import { NodeSensors, RateOfChange, RiskLevel, AiPredictionData, SensorNode } from '../types';

export interface SensorThresholds {
  tiltWarning: number;        // e.g. 1.0 deg
  tiltCritical: number;       // e.g. 2.0 deg
  vibrationWarning: number;   // e.g. 1.5 mm/s
  vibrationCritical: number;  // e.g. 2.5 mm/s
  displacementWarning: number;// e.g. 1.5 mm
  displacementCritical: number;// e.g. 3.0 mm
  tiltRateWarning: number;    // e.g. 0.3 deg/hr
  dispRateWarning: number;    // e.g. 0.5 mm/hr
}

export const DEFAULT_THRESHOLDS: SensorThresholds = {
  tiltWarning: 1.0,
  tiltCritical: 2.0,
  vibrationWarning: 1.5,
  vibrationCritical: 2.5,
  displacementWarning: 1.5,
  displacementCritical: 3.0,
  tiltRateWarning: 0.3,
  dispRateWarning: 0.5,
};

/**
 * Calculates rate of change between current and previous readings
 */
export function calculateRateOfChange(
  current: NodeSensors,
  previous?: NodeSensors,
  elapsedHours: number = 1
): RateOfChange {
  if (!previous) {
    return {
      tiltRate: 0,
      vibrationRate: 0,
      displacementRate: 0,
      tiltTrend: 'stable',
      vibrationTrend: 'stable',
      displacementTrend: 'stable',
    };
  }

  const effectiveHours = Math.max(0.1, elapsedHours);
  const tiltDiff = current.tiltMagnitude - previous.tiltMagnitude;
  const vibDiff = current.vibration - previous.vibration;
  const dispDiff = current.displacement - previous.displacement;

  const tiltRate = Number((tiltDiff / effectiveHours).toFixed(3));
  const vibrationRate = Number((vibDiff / effectiveHours).toFixed(3));
  const displacementRate = Number((dispDiff / effectiveHours).toFixed(3));

  return {
    tiltRate,
    vibrationRate,
    displacementRate,
    tiltTrend: tiltDiff > 0.05 ? 'increasing' : tiltDiff < -0.05 ? 'decreasing' : 'stable',
    vibrationTrend: vibDiff > 0.1 ? 'increasing' : vibDiff < -0.1 ? 'decreasing' : 'stable',
    displacementTrend: dispDiff > 0.1 ? 'increasing' : dispDiff < -0.1 ? 'decreasing' : 'stable',
  };
}

/**
 * Multi-sensor correlation risk engine
 */
export function calculateNodeRisk(
  sensors: NodeSensors,
  rateOfChange: RateOfChange,
  thresholds: SensorThresholds = DEFAULT_THRESHOLDS
): { riskScore: number; riskLevel: RiskLevel; reason: string } {
  let score = 5; // Baseline healthy ground stability
  const abnormalFactors: string[] = [];

  // 1. Ground Tilt Component (up to 30 pts)
  if (sensors.tiltMagnitude >= thresholds.tiltCritical) {
    score += 30;
    abnormalFactors.push(`Critical tilt (${sensors.tiltMagnitude.toFixed(2)}°)`);
  } else if (sensors.tiltMagnitude >= thresholds.tiltWarning) {
    score += 15 + ((sensors.tiltMagnitude - thresholds.tiltWarning) / (thresholds.tiltCritical - thresholds.tiltWarning)) * 15;
    abnormalFactors.push(`Abnormal tilt (${sensors.tiltMagnitude.toFixed(2)}°)`);
  }

  // 2. Vibration / Blast Seismicity Component (up to 25 pts)
  if (sensors.vibration >= thresholds.vibrationCritical) {
    score += 25;
    abnormalFactors.push(`Severe vibration (${sensors.vibration.toFixed(2)} mm/s)`);
  } else if (sensors.vibration >= thresholds.vibrationWarning) {
    score += 12 + ((sensors.vibration - thresholds.vibrationWarning) / (thresholds.vibrationCritical - thresholds.vibrationWarning)) * 13;
    abnormalFactors.push(`Elevated vibration (${sensors.vibration.toFixed(2)} mm/s)`);
  }

  // 3. Surface Displacement Component (up to 25 pts)
  if (sensors.displacement >= thresholds.displacementCritical) {
    score += 25;
    abnormalFactors.push(`Critical subsidence displacement (${sensors.displacement.toFixed(2)} mm)`);
  } else if (sensors.displacement >= thresholds.displacementWarning) {
    score += 10 + ((sensors.displacement - thresholds.displacementWarning) / (thresholds.displacementCritical - thresholds.displacementWarning)) * 15;
    abnormalFactors.push(`Active displacement (${sensors.displacement.toFixed(2)} mm)`);
  }

  // 4. Crack Detector Component (instant heavy weight - up to 25 pts)
  if (sensors.crack) {
    score += 25;
    abnormalFactors.push('Optical crack sensor triggered (Tensile surface shearing)');
  }

  // 5. Rate of Change dynamic multiplier
  if (rateOfChange.displacementRate > thresholds.dispRateWarning || rateOfChange.tiltRate > thresholds.tiltRateWarning) {
    score += 15;
    abnormalFactors.push(`Rapid deformation acceleration (+${rateOfChange.displacementRate} mm/h)`);
  }

  // Clamp score
  const finalScore = Math.min(100, Math.round(score));

  let riskLevel: RiskLevel = 'NORMAL';
  if (finalScore >= 76) {
    riskLevel = 'CRITICAL';
  } else if (finalScore >= 51) {
    riskLevel = 'HIGH';
  } else if (finalScore >= 26) {
    riskLevel = 'WARNING';
  } else {
    riskLevel = 'NORMAL';
  }

  const reason = abnormalFactors.length > 0
    ? abnormalFactors.join(' | ')
    : 'All parameters within stable geological thresholds';

  return {
    riskScore: finalScore,
    riskLevel,
    reason,
  };
}

/**
 * Aggregates cluster data to generate AI Subsidence Prediction
 */
export function generateAiSubsidencePrediction(nodes: SensorNode[]): AiPredictionData {
  const highRiskNodes = nodes.filter(n => n.riskLevel === 'CRITICAL' || n.riskLevel === 'HIGH');
  const warningNodes = nodes.filter(n => n.riskLevel === 'WARNING');

  if (highRiskNodes.length > 0) {
    const highestNode = [...highRiskNodes].sort((a, b) => b.riskScore - a.riskScore)[0];
    const avgScore = Math.round(highRiskNodes.reduce((acc, n) => acc + n.riskScore, 0) / highRiskNodes.length);

    return {
      predictedZone: highestNode.location.zone || 'Zone 3B',
      estimatedSeverity: avgScore >= 80 ? 'CRITICAL' : 'HIGH',
      expectedProgression: avgScore >= 80 ? '24–48 hours' : '3–7 days',
      riskScore: avgScore,
      confidence: 91,
      affectedNodes: highRiskNodes.map(n => n.label),
      anomalies: [
        'Differential tensile shear detected across surface mesh',
        'Seismic acceleration correlated with continuous crack opening',
        'Bed separation in upper overburden strata'
      ],
      recommendedActions: [
        'Restrict surface heavy vehicular movement over Zone 3B perimeter',
        'Verify underground roadway roof bolting and stowing compaction',
        'Keep emergency audio buzzer on standby for evacuation'
      ],
      disclaimer: 'AI/ML Prototype Prediction – Experimental model based on geological mesh correlation.'
    };
  }

  if (warningNodes.length > 0) {
    const highestNode = [...warningNodes].sort((a, b) => b.riskScore - a.riskScore)[0];
    return {
      predictedZone: highestNode.location.zone || 'Zone 2A',
      estimatedSeverity: 'MEDIUM',
      expectedProgression: '7–14 days',
      riskScore: 42,
      confidence: 84,
      affectedNodes: warningNodes.map(n => n.label),
      anomalies: [
        'Minor tilt acceleration noted on peripheral monitoring perimeter'
      ],
      recommendedActions: [
        'Increase telemetry polling rate on Zone 2A nodes to 1 minute',
        'Perform visual physical geotechnical inspection of surface cracks'
      ],
      disclaimer: 'AI/ML Prototype Prediction – Experimental model based on geological mesh correlation.'
    };
  }

  return {
    predictedZone: 'All Zones Stable',
    estimatedSeverity: 'LOW',
    expectedProgression: 'No subsidence anticipated (> 30 days)',
    riskScore: 12,
    confidence: 94,
    affectedNodes: [],
    anomalies: ['Uniform equilibrium maintained across all mesh nodes'],
    recommendedActions: ['Continue standard low-power 15-minute sensor telemetry polling'],
    disclaimer: 'AI/ML Prototype Prediction – Experimental model based on geological mesh correlation.'
  };
}
