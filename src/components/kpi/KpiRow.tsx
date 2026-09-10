import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useKavachData } from '../../hooks/useKavachData';
import { 
  Radio, 
  TriangleAlert, 
  Activity, 
  ArrowLeftRight, 
  AlertOctagon 
} from 'lucide-react';

export const KpiRow: React.FC = () => {
  const { t } = useLanguage();
  const { kpis } = useKavachData();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {/* 1. Total Sensor Nodes */}
      <div 
        id="kpi-card-total-nodes"
        className="bg-[#0f172a]/95 border border-slate-800 rounded-xl p-3.5 flex items-center space-x-3.5 shadow-sm hover:border-slate-700 transition-colors"
      >
        <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-center shrink-0">
          <Radio className="w-6 h-6 text-cyan-400" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400 truncate">{t('total_sensor_nodes')}</p>
          <p className="text-2xl font-bold font-display text-white tracking-tight leading-tight">
            {kpis.totalNodes}
          </p>
          <div className="flex items-center space-x-2 text-[11px] text-slate-400 pt-0.5">
            <span className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>{kpis.onlineNodes} {t('online')}</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
              <span>{kpis.offlineNodes} {t('offline')}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Avg Ground Tilt */}
      <div 
        id="kpi-card-ground-tilt"
        className="bg-[#0f172a]/95 border border-slate-800 rounded-xl p-3.5 flex items-center space-x-3.5 shadow-sm hover:border-slate-700 transition-colors"
      >
        <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center shrink-0">
          <TriangleAlert className="w-6 h-6 text-emerald-400" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400 truncate">{t('avg_ground_tilt')}</p>
          <p className="text-2xl font-bold font-display text-white tracking-tight leading-tight">
            {kpis.avgTilt}°
          </p>
          <p className="text-[11px] text-emerald-400 flex items-center space-x-1 pt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>({t('normal_range')})</span>
          </p>
        </div>
      </div>

      {/* 3. Avg Vibration Level */}
      <div 
        id="kpi-card-vibration"
        className="bg-[#0f172a]/95 border border-slate-800 rounded-xl p-3.5 flex items-center space-x-3.5 shadow-sm hover:border-slate-700 transition-colors"
      >
        <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-800/60 flex items-center justify-center shrink-0">
          <Activity className="w-6 h-6 text-purple-400" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400 truncate">{t('avg_vibration_level')}</p>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold font-display text-white tracking-tight leading-tight">
              {kpis.avgVibration}
            </span>
            <span className="text-xs text-slate-400 font-mono-tech">mm/s</span>
          </div>
          <p className="text-[11px] text-emerald-400 flex items-center space-x-1 pt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>({t('normal_range')})</span>
          </p>
        </div>
      </div>

      {/* 4. Max Displacement */}
      <div 
        id="kpi-card-displacement"
        className="bg-[#0f172a]/95 border border-slate-800 rounded-xl p-3.5 flex items-center space-x-3.5 shadow-sm hover:border-slate-700 transition-colors"
      >
        <div className="w-12 h-12 rounded-xl bg-teal-950/80 border border-teal-800/60 flex items-center justify-center shrink-0">
          <ArrowLeftRight className="w-6 h-6 text-teal-400" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400 truncate">{t('max_displacement')}</p>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold font-display text-white tracking-tight leading-tight">
              {kpis.maxDisplacement}
            </span>
            <span className="text-xs text-slate-400 font-mono-tech">mm</span>
          </div>
          <p className="text-[11px] text-emerald-400 flex items-center space-x-1 pt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>({t('normal_range')})</span>
          </p>
        </div>
      </div>

      {/* 5. Risk Zones */}
      <div 
        id="kpi-card-risk-zones"
        className="bg-[#0f172a]/95 border border-slate-800 rounded-xl p-3.5 flex items-center space-x-3.5 shadow-sm hover:border-slate-700 transition-colors"
      >
        <div className="w-12 h-12 rounded-xl bg-red-950/80 border border-red-800/60 flex items-center justify-center shrink-0">
          <AlertOctagon className="w-6 h-6 text-red-500 animate-pulse" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400 truncate">{t('risk_zones')}</p>
          <p className="text-2xl font-bold font-display text-white tracking-tight leading-tight">
            {kpis.riskZonesCount}
          </p>
          <p className="text-[11px] text-red-400 font-medium pt-0.5">
            ({t('high_risk')})
          </p>
        </div>
      </div>
    </div>
  );
};
