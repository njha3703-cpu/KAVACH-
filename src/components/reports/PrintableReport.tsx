import React from 'react';
import { SensorNode, Alert, SystemHealth, AiPredictionData } from '../../types';
import { KavachLogo } from '../common/KavachLogo';
import { ShieldCheck, AlertTriangle, Printer, X, Download } from 'lucide-react';

interface PrintableReportProps {
  nodes: SensorNode[];
  alerts: Alert[];
  systemHealth: SystemHealth;
  aiPrediction: AiPredictionData;
  kpis: {
    totalNodes: number;
    onlineNodes: number;
    offlineNodes: number;
    avgTilt: string;
    avgVibration: string;
    maxDisplacement: string;
    riskZonesCount: number;
  };
  onClose?: () => void;
  isModal?: boolean;
}

export const PrintableReport: React.FC<PrintableReportProps> = ({
  nodes,
  alerts,
  systemHealth,
  aiPrediction,
  kpis,
  onClose,
  isModal = false,
}) => {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const currentTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const highRiskNodes = nodes.filter(
    n => n.riskLevel === 'CRITICAL' || n.riskLevel === 'HIGH' || n.isHighRisk
  );

  const riskZones = Array.from(new Set(nodes.map(n => n.location.zone))).map(zoneName => {
    const zoneNodes = nodes.filter(n => n.location.zone === zoneName);
    const hasCritical = zoneNodes.some(n => n.riskLevel === 'CRITICAL');
    const hasHigh = zoneNodes.some(n => n.riskLevel === 'HIGH');
    const maxScore = Math.max(...zoneNodes.map(n => n.riskScore), 0);
    return {
      zone: zoneName,
      status: hasCritical ? 'CRITICAL HAZARD' : hasHigh ? 'HIGH RISK' : 'STABLE / NORMAL',
      nodeCount: zoneNodes.length,
      maxScore,
    };
  });

  const handlePrint = () => {
    window.print();
  };

  const reportContent = (
    <div className="bg-white text-slate-900 p-8 max-w-4xl mx-auto font-sans leading-relaxed text-xs">
      {/* 1. Official Header & Logo */}
      <div className="border-b-2 border-slate-900 pb-4 mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <KavachLogo size={48} showWordmark={false} />
          <div>
            <h1 className="text-xl font-black tracking-wider uppercase font-display text-slate-950">
              KAVACH
            </h1>
            <p className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">
              AI-Powered Mine Subsidence Monitoring & Early Warning System
            </p>
            <p className="text-[10px] text-slate-500 font-mono-tech">
              DGMS Technical Safety Directive • Geotechnical Mine Safety Compliance
            </p>
          </div>
        </div>

        <div className="text-right font-mono-tech text-[10px] text-slate-600">
          <p className="font-bold text-slate-900 text-xs">GEOTECHNICAL REPORT</p>
          <p>Doc Ref: KAVACH-SUB-2026-09</p>
          <p>Classification: OFFICIAL / SAFETY CRITICAL</p>
        </div>
      </div>

      {/* 2. Metadata Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 border border-slate-300 rounded mb-4 font-mono-tech text-[11px]">
        <div>
          <span className="text-slate-500 block text-[9px] uppercase">Mine / Site</span>
          <span className="font-bold text-slate-900">Jharia Coalfield Pit 3B</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[9px] uppercase">Report Date</span>
          <span className="font-bold text-slate-900">{currentDate}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[9px] uppercase">Report Time</span>
          <span className="font-bold text-slate-900">{currentTime}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[9px] uppercase">Supervising Officer</span>
          <span className="font-bold text-slate-900">Safety Officer (On Duty)</span>
        </div>
      </div>

      {/* 3. Sensor Summary */}
      <div className="mb-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">
          1. Geotechnical Sensor Summary
        </h2>
        <div className="grid grid-cols-4 gap-2 text-center font-mono-tech">
          <div className="p-2 border border-slate-200 rounded bg-slate-50">
            <span className="text-[9px] text-slate-500 block">Avg Ground Tilt</span>
            <span className="text-sm font-bold text-slate-900">{kpis.avgTilt}°</span>
            <span className="text-[9px] text-slate-500 block">Max Limit: 1.0°</span>
          </div>
          <div className="p-2 border border-slate-200 rounded bg-slate-50">
            <span className="text-[9px] text-slate-500 block">Avg Vibration</span>
            <span className="text-sm font-bold text-slate-900">{kpis.avgVibration} mm/s</span>
            <span className="text-[9px] text-slate-500 block">Seismic Velocity</span>
          </div>
          <div className="p-2 border border-slate-200 rounded bg-slate-50">
            <span className="text-[9px] text-slate-500 block">Max Strata Displacement</span>
            <span className="text-sm font-bold text-slate-900">{kpis.maxDisplacement} mm</span>
            <span className="text-[9px] text-slate-500 block">Critical: 3.5 mm</span>
          </div>
          <div className="p-2 border border-slate-200 rounded bg-slate-50">
            <span className="text-[9px] text-slate-500 block">Active Risk Zones</span>
            <span className={`text-sm font-bold ${kpis.riskZonesCount > 0 ? 'text-red-600' : 'text-emerald-700'}`}>
              {kpis.riskZonesCount} Zone(s)
            </span>
            <span className="text-[9px] text-slate-500 block">DGMS Monitored</span>
          </div>
        </div>
      </div>

      {/* 4. Node Summary Table */}
      <div className="mb-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2 flex justify-between">
          <span>2. Sensor Node Summary ({nodes.length} Configured Nodes)</span>
          <span className="text-[10px] font-mono-tech text-slate-500">
            {kpis.onlineNodes} Online • {kpis.offlineNodes} Offline
          </span>
        </h2>
        <table className="w-full text-left border-collapse border border-slate-300 font-mono-tech text-[10px]">
          <thead className="bg-slate-100 text-slate-700 font-bold">
            <tr>
              <th className="border border-slate-300 p-1.5">Node ID</th>
              <th className="border border-slate-300 p-1.5">Zone</th>
              <th className="border border-slate-300 p-1.5">Status</th>
              <th className="border border-slate-300 p-1.5">Tilt (Mag)</th>
              <th className="border border-slate-300 p-1.5">Vibration</th>
              <th className="border border-slate-300 p-1.5">Displacement</th>
              <th className="border border-slate-300 p-1.5">Crack</th>
              <th className="border border-slate-300 p-1.5">Risk Score</th>
              <th className="border border-slate-300 p-1.5">Battery</th>
            </tr>
          </thead>
          <tbody>
            {nodes.map(node => (
              <tr key={node.id} className={node.riskLevel === 'CRITICAL' ? 'bg-red-50 font-bold text-red-900' : ''}>
                <td className="border border-slate-300 p-1.5">{node.id}</td>
                <td className="border border-slate-300 p-1.5">{node.location.zone}</td>
                <td className="border border-slate-300 p-1.5">{node.status}</td>
                <td className="border border-slate-300 p-1.5">{node.sensors.tiltMagnitude}°</td>
                <td className="border border-slate-300 p-1.5">{node.sensors.vibration} mm/s</td>
                <td className="border border-slate-300 p-1.5">{node.sensors.displacement} mm</td>
                <td className="border border-slate-300 p-1.5">{node.sensors.crack ? 'DETECTED' : 'None'}</td>
                <td className="border border-slate-300 p-1.5">{node.riskScore} / 100</td>
                <td className="border border-slate-300 p-1.5">{node.battery}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 5. Risk Zones & High-Risk Nodes */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Risk Zones */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">
            3. Strata Risk Zones Assessment
          </h2>
          <div className="space-y-1.5 font-mono-tech text-[10px]">
            {riskZones.map(rz => (
              <div key={rz.zone} className="p-2 border border-slate-200 rounded flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900">{rz.zone}</span>
                  <span className="text-[9px] text-slate-500 block">{rz.nodeCount} node(s)</span>
                </div>
                <div className="text-right">
                  <span className={`px-1.5 py-0.5 rounded font-bold text-[9px] ${
                    rz.status.includes('CRITICAL') ? 'bg-red-100 text-red-800 border border-red-300' :
                    rz.status.includes('HIGH') ? 'bg-orange-100 text-orange-800 border border-orange-300' :
                    'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}>
                    {rz.status}
                  </span>
                  <span className="text-[9px] text-slate-500 block">Peak Risk: {rz.maxScore}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High-Risk Nodes */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">
            4. High-Risk Node Callouts
          </h2>
          {highRiskNodes.length === 0 ? (
            <div className="p-3 border border-slate-200 rounded text-slate-500 text-[11px] bg-slate-50">
              ✓ No high-risk or critical nodes currently active. All telemetry within nominal DGMS baseline thresholds.
            </div>
          ) : (
            <div className="space-y-1.5 font-mono-tech text-[10px]">
              {highRiskNodes.map(hr => (
                <div key={hr.id} className="p-2 border-l-4 border-red-600 bg-red-50/70 border border-slate-200 rounded">
                  <div className="flex justify-between font-bold text-red-950">
                    <span>{hr.id} ({hr.location.zone})</span>
                    <span>Score: {hr.riskScore}/100</span>
                  </div>
                  <p className="text-[9px] text-red-800 mt-0.5">
                    Tilt: {hr.sensors.tiltMagnitude}° | Vib: {hr.sensors.vibration} mm/s | Disp: {hr.sensors.displacement} mm | Crack: {hr.sensors.crack ? 'YES' : 'NO'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 6. Critical Alerts & Alert History */}
      <div className="mb-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">
          5. Critical Alerts & Subsurface Log History
        </h2>
        {alerts.length === 0 ? (
          <div className="p-2 border border-slate-200 rounded text-slate-500 text-[10px]">
            No alert logs recorded in this session.
          </div>
        ) : (
          <table className="w-full text-left border-collapse border border-slate-300 font-mono-tech text-[10px]">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="border border-slate-300 p-1">Time</th>
                <th className="border border-slate-300 p-1">Severity</th>
                <th className="border border-slate-300 p-1">Target</th>
                <th className="border border-slate-300 p-1">Event Description</th>
                <th className="border border-slate-300 p-1">Status</th>
              </tr>
            </thead>
            <tbody>
              {alerts.slice(0, 6).map(a => (
                <tr key={a.id}>
                  <td className="border border-slate-300 p-1 text-slate-600">{a.timestamp}</td>
                  <td className="border border-slate-300 p-1 font-bold">
                    <span className={a.severity === 'CRITICAL' ? 'text-red-700' : a.severity === 'HIGH' ? 'text-orange-700' : 'text-slate-800'}>
                      {a.severity}
                    </span>
                  </td>
                  <td className="border border-slate-300 p-1">{a.nodeId} ({a.zone})</td>
                  <td className="border border-slate-300 p-1">{a.reason}</td>
                  <td className="border border-slate-300 p-1 uppercase">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 7. AI Prediction Summary */}
      <div className="mb-4 p-3 border border-purple-200 bg-purple-50/50 rounded">
        <h2 className="text-xs font-bold uppercase tracking-wider text-purple-950 border-b border-purple-200 pb-1 mb-2">
          6. AI Subsidence Prediction Summary
        </h2>
        <div className="grid grid-cols-3 gap-3 font-mono-tech text-[10px]">
          <div>
            <span className="text-purple-700 block text-[9px]">Predicted High-Risk Zone</span>
            <span className="font-bold text-purple-950">{aiPrediction.predictedZone}</span>
          </div>
          <div>
            <span className="text-purple-700 block text-[9px]">Expected Progression Window</span>
            <span className="font-bold text-purple-950">{aiPrediction.timeHorizon}</span>
          </div>
          <div>
            <span className="text-purple-700 block text-[9px]">Model Confidence</span>
            <span className="font-bold text-purple-950">{aiPrediction.confidenceScore}%</span>
          </div>
        </div>
        <p className="text-[10px] text-purple-900 mt-2 font-sans italic">
          {aiPrediction.explanation}
        </p>
      </div>

      {/* 8. System Health */}
      <div className="mb-6 p-2.5 bg-slate-50 border border-slate-200 rounded font-mono-tech text-[10px]">
        <span className="font-bold text-slate-900 block mb-1 uppercase">7. System Infrastructure Health</span>
        <div className="grid grid-cols-4 gap-2 text-slate-700">
          <div>ESP-NOW Gateway: <span className="font-bold text-emerald-700">{systemHealth.gatewayStatus}</span></div>
          <div>WiFi Uplink: <span className="font-bold text-emerald-700">{systemHealth.wifiStatus}</span></div>
          <div>Cloud Database: <span className="font-bold text-emerald-700">{systemHealth.cloudStatus}</span></div>
          <div>Active Deployed Nodes: <span className="font-bold text-slate-900">{systemHealth.sensorNetworkOnline} / {systemHealth.sensorNetworkTotal}</span></div>
        </div>
      </div>

      {/* 9. Signatures & Verification */}
      <div className="grid grid-cols-2 gap-8 pt-4 border-t-2 border-slate-900 font-mono-tech text-[10px]">
        <div>
          <p className="text-slate-500 mb-6">Prepared by Shift Geotechnical Operator:</p>
          <div className="border-b border-slate-400 w-48 mb-1"></div>
          <p className="font-bold text-slate-900">Operator Sign & Date</p>
        </div>
        <div className="text-right">
          <p className="text-slate-500 mb-6">Countersigned by Mine Safety Officer:</p>
          <div className="border-b border-slate-400 w-48 ml-auto mb-1"></div>
          <p className="font-bold text-slate-900">DGMS Certified Safety Incharge</p>
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-5xl my-8 shadow-2xl flex flex-col max-h-[90vh]">
          {/* Modal Header Bar */}
          <div className="p-4 bg-[#131d36] border-b border-slate-800 flex items-center justify-between text-white">
            <div className="flex items-center space-x-2">
              <Printer className="w-5 h-5 text-cyan-400" />
              <span className="font-bold text-sm uppercase tracking-wide">
                Print Report & Geotechnical Export
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                id="modal-trigger-print-btn"
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors shadow"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document / Save as PDF</span>
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Modal Scrollable Report Preview */}
          <div className="p-6 overflow-y-auto flex-1 bg-slate-200">
            <div className="shadow-xl rounded">
              {reportContent}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Non-modal printable element (used by @media print)
  return (
    <div id="kavach-printable-report" className="hidden print:block">
      {reportContent}
    </div>
  );
};
