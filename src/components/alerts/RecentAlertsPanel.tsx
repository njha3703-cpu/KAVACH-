import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useKavachData } from '../../hooks/useKavachData';
import { Alert } from '../../types';
import { 
  Bell, 
  AlertTriangle, 
  Activity, 
  Radio, 
  Info, 
  CheckCircle2,
  Check,
  RotateCcw
} from 'lucide-react';

export const RecentAlertsPanel: React.FC = () => {
  const { t } = useLanguage();
  const { alerts, setFocusedNodeId, acknowledgeAlert, resolveAlert } = useKavachData();

  // Pick top 5 alerts
  const displayAlerts = alerts.slice(0, 5);

  const getAlertIcon = (alert: Alert) => {
    if (alert.severity === 'CRITICAL' || alert.severity === 'HIGH') {
      return (
        <div className="w-8 h-8 rounded-xl bg-red-950/90 border border-red-800/80 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
        </div>
      );
    }
    if (alert.title.toLowerCase().includes('crack')) {
      return (
        <div className="w-8 h-8 rounded-xl bg-amber-950/90 border border-amber-800/80 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
        </div>
      );
    }
    if (alert.severity === 'WARNING') {
      return (
        <div className="w-8 h-8 rounded-xl bg-yellow-950/90 border border-yellow-800/80 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-4 h-4 text-yellow-400" />
        </div>
      );
    }
    if (alert.title.toLowerCase().includes('reconnected')) {
      return (
        <div className="w-8 h-8 rounded-xl bg-emerald-950/90 border border-emerald-800/80 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-xl bg-blue-950/90 border border-blue-800/80 flex items-center justify-center shrink-0">
        <Info className="w-4 h-4 text-cyan-400" />
      </div>
    );
  };

  const getSeverityBadge = (severity: string, title: string) => {
    if (severity === 'CRITICAL' || severity === 'HIGH') {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-950 text-red-400 border border-red-800">High</span>;
    }
    if (title.toLowerCase().includes('reconnected')) {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">Info</span>;
    }
    if (severity === 'WARNING') {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800">Medium</span>;
    }
    return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-950 text-cyan-400 border border-blue-800">Low</span>;
  };

  return (
    <div className="bg-[#0f172a]/95 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between h-[460px] shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4 text-slate-300" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            {t('recent_alerts')}
          </h3>
        </div>
        <Link
          to="/alerts"
          id="recent-alerts-view-all-link"
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
        >
          {t('view_all')}
        </Link>
      </div>

      {/* Alert Feed */}
      <div className="space-y-2.5 overflow-y-auto pr-1 my-2 grow">
        {displayAlerts.map(alert => (
          <div
            key={alert.id}
            onClick={() => setFocusedNodeId(alert.nodeId)}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer text-left flex items-start justify-between gap-3 group ${
              alert.severity === 'CRITICAL' || alert.severity === 'HIGH'
                ? 'bg-red-950/20 border-red-900/40 hover:border-red-600/70 hover:bg-red-950/30'
                : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-850'
            }`}
          >
            <div className="flex items-start space-x-2.5 min-w-0">
              {getAlertIcon(alert)}
              <div className="min-w-0">
                <p className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                  {alert.title}
                </p>
                <p className="text-[11px] text-slate-400 leading-snug line-clamp-1">
                  {alert.reason}
                </p>
                {alert.status !== 'active' && (
                  <span className="inline-block mt-1 text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono-tech">
                    {alert.status === 'acknowledged' ? `Ack by ${alert.acknowledgedBy || 'Operator'}` : 'Resolved'}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end shrink-0 space-y-1">
              <span className="text-[10px] text-slate-400 font-mono-tech">
                {alert.timestamp}
              </span>
              {getSeverityBadge(alert.severity, alert.title)}

              {/* Action buttons on hover */}
              {alert.status === 'active' && (
                <button
                  id={`ack-btn-${alert.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    acknowledgeAlert(alert.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-slate-300 hover:text-white bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700"
                  title="Acknowledge Alert"
                >
                  Ack
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Status bar */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span className="font-mono-tech">Autonomous AI Edge Triage</span>
        <span className="text-emerald-400 flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>Feed Live</span>
        </span>
      </div>
    </div>
  );
};
