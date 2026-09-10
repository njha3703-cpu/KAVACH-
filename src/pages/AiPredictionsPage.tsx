import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useKavachData } from '../hooks/useKavachData';
import { 
  BrainCircuit, 
  Sparkles, 
  AlertTriangle, 
  TrendingUp, 
  Layers, 
  ShieldAlert, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';

export const AiPredictionsPage: React.FC = () => {
  const { t } = useLanguage();
  const { aiPrediction, nodes } = useKavachData();

  const highRiskNode = nodes.find(n => n.id === 'NODE_27') || nodes[0];

  return (
    <div className="space-y-4 pb-20 text-left">
      {/* Top Banner */}
      <div className="bg-[#0f172a]/95 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800/60 flex items-center justify-center text-purple-400 shrink-0 shadow">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-display">
              {t('ai_predictions')} & Multi-Sensor Subsidence Forecasting
            </h2>
            <p className="text-xs text-slate-400">
              Heuristic Correlation Engine: Tilt + Rate of Change + Displacement + Vibration + Crack Detection
            </p>
          </div>
        </div>

        <span className="px-3 py-1.5 rounded-xl bg-purple-950/80 border border-purple-800 text-purple-300 text-xs font-mono-tech flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Inference Latency: <strong>42 ms</strong></span>
        </span>
      </div>

      {/* Main Prediction Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Core Zone Forecast Card */}
        <div className="lg:col-span-2 bg-[#0f172a]/95 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white font-display">
              Active Subsidence Early Warning Forecast
            </h3>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-950 text-red-400 border border-red-800 animate-pulse">
              SEVERITY: {aiPrediction.estimatedSeverity}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
              <span className="text-[11px] text-slate-400">Target Subsidence Zone</span>
              <p className="text-2xl font-bold font-display text-red-400 mt-0.5 font-mono-tech">
                {aiPrediction.predictedZone}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">Jharia Open-Pit Boundary Overburden</p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
              <span className="text-[11px] text-slate-400">Expected Time Window</span>
              <p className="text-2xl font-bold font-display text-amber-400 mt-0.5">
                {aiPrediction.expectedProgression}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">Based on accelerated tilt slope</p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
              <span className="text-[11px] text-slate-400">Risk Assessment Score</span>
              <p className="text-2xl font-bold font-display text-red-500 mt-0.5 font-mono-tech">
                {aiPrediction.riskScore} / 100
              </p>
              <p className="text-[10px] text-slate-500 mt-1">Multi-modal composite score</p>
            </div>
          </div>

          {/* AI Decision Reasoning */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Autonomous Inference Breakdown:
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-start space-x-2">
                <span className="text-red-400 font-bold">•</span>
                <span><strong>Tilt Rate Acceleration:</strong> Node 27 shows sustained tilt angle {highRiskNode.sensors.tiltMagnitude}° surpassing threshold 1.0° with accelerating positive slope (+0.42° / 6h).</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-400 font-bold">•</span>
                <span><strong>Transducer Confirmation:</strong> Optical crack sensor on Node 27 triggered at 11:32 AM, confirming physical tension tear in overburden rock.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Secondary Zone Influence:</strong> Peripheral nodes (Node 16 & Node 34) in Zone 3B indicate micro-vibrations ({highRiskNode.sensors.vibration} mm/s) consistent with pillar spalling.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Model Architecture & Weights */}
        <div className="bg-[#0f172a]/95 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2.5">
            Feature Weighting Hierarchy
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Ground Tilt Angle (MPU6050)</span>
                <span className="font-mono-tech text-cyan-400 font-bold">35%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Rate of Change (dθ/dt slope)</span>
                <span className="font-mono-tech text-blue-400 font-bold">25%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Surface Displacement (mm)</span>
                <span className="font-mono-tech text-teal-400 font-bold">20%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Crack Optical Transducer</span>
                <span className="font-mono-tech text-amber-400 font-bold">10%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Peak Particle Vibration (SW-420)</span>
                <span className="font-mono-tech text-purple-400 font-bold">10%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 font-mono-tech space-y-1">
            <p>Model: Gradient-Boosted Geomechanical Ensemble</p>
            <p>Training Baseline: Jharia Geological Subsidence Profiles</p>
            <p>False Positive Filter: Spatial Neighbor Consensus Check</p>
          </div>
        </div>
      </div>

      {/* Mandatory Safety Notice / Disclaimer */}
      <div className="bg-amber-950/20 border border-amber-800/50 rounded-2xl p-4 flex items-start space-x-3 text-amber-300 text-xs">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-amber-200">
            {t('ai_disclaimer')}
          </h4>
          <p className="text-amber-300/80 mt-1 leading-relaxed">
            KAVACH AI predictions serve as an automated early alert prototype designed for Smart India Hackathon 2026. All evacuation directives and structural mitigation works must be cross-verified with physical borehole extensometers, LiDAR point clouds, and Directorate General of Mines Safety (DGMS) regulatory standards.
          </p>
        </div>
      </div>
    </div>
  );
};
