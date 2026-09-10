import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useKavachData } from '../../hooks/useKavachData';
import { Brain, Sparkles, AlertCircle } from 'lucide-react';

export const AiPredictionCard: React.FC = () => {
  const { t } = useLanguage();
  const { aiPrediction } = useKavachData();
  const navigate = useNavigate();

  return (
    <div className="bg-[#0f172a]/95 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm h-[320px]">
      {/* Header */}
      <div className="flex items-center space-x-2 border-b border-slate-800/80 pb-2.5">
        <Brain className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-bold text-white tracking-wide">
          {t('ai_prediction')}
        </h3>
      </div>

      {/* Top Graphic + Legend Row (matching reference image) */}
      <div className="flex items-center justify-between gap-3 py-1">
        {/* Contour Map Visualization */}
        <div className="relative w-36 h-24 rounded-xl overflow-hidden bg-slate-900 border border-slate-700/80 flex items-center justify-center shrink-0">
          {/* Layered concentric contour SVG */}
          <svg className="w-full h-full" viewBox="0 0 140 95">
            {/* Background geology */}
            <rect width="140" height="95" fill="#0f172a" />
            
            {/* Outer Green Ring */}
            <circle cx="70" cy="48" r="42" fill="#10b981" fillOpacity="0.25" stroke="#059669" strokeWidth="1" strokeDasharray="3, 2" />
            
            {/* Middle Yellow Ring */}
            <circle cx="70" cy="48" r="28" fill="#f59e0b" fillOpacity="0.4" stroke="#d97706" strokeWidth="1" />
            
            {/* Inner Red Core */}
            <circle cx="70" cy="48" r="14" fill="#ef4444" fillOpacity="0.7" stroke="#dc2626" strokeWidth="1.5" />
            
            {/* Center target icon */}
            <circle cx="70" cy="48" r="4" fill="#ffffff" />
            <line x1="70" y1="20" x2="70" y2="76" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.5" />
            <line x1="42" y1="48" x2="98" y2="48" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.5" />
          </svg>

          <span className="absolute bottom-1 right-1.5 text-[8px] font-mono-tech text-slate-400 bg-slate-950/80 px-1 rounded">
            Zone 3B Core
          </span>
        </div>

        {/* Legend on right */}
        <div className="flex flex-col space-y-2 text-[11px] text-slate-300">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span>{t('high_risk')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>{t('medium_risk')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>{t('low_risk')}</span>
          </div>
        </div>
      </div>

      {/* Prediction Details (exact reproduction of text in reference image) */}
      <div className="space-y-1 text-xs text-left bg-slate-900/60 p-2 rounded-xl border border-slate-800/70">
        <div className="flex items-baseline justify-between">
          <span className="text-slate-400">{t('predicted_zone')}:</span>
          <span className="font-bold text-red-400 font-mono-tech">{aiPrediction.predictedZone}</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-slate-400">{t('estimated_severity')}:</span>
          <span className="font-bold text-red-400">{aiPrediction.estimatedSeverity}</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-slate-400">{t('expected_progression')}:</span>
          <span className="font-bold text-amber-300">{aiPrediction.expectedProgression}</span>
        </div>
      </div>

      {/* Button */}
      <button
        id="view-detailed-analysis-btn"
        onClick={() => navigate('/ai-predictions')}
        className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-md flex items-center justify-center space-x-1.5"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>{t('view_detailed_analysis')}</span>
      </button>

      {/* Disclaimer */}
      <p className="text-[9px] text-slate-500 tracking-tight leading-tight text-center">
        {t('ai_disclaimer')}
      </p>
    </div>
  );
};
