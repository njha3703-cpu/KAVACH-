import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useKavachData } from '../hooks/useKavachData';
import { Alert } from '../types';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  SlidersHorizontal, 
  Clock, 
  ShieldCheck, 
  Flame 
} from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const { t } = useLanguage();
  const { 
    alerts, 
    activeAlerts,
    alertHistory,
    acknowledgeAlert, 
    resolveAlert, 
    markAlertAsRead,
    openNodeDetails,
    sirenState, 
    triggerSiren, 
    stopSiren, 
    setFocusedNodeId 
  } = useKavachData();

  // Default to ACTIVE alerts as required by Requirement 5
  const [statusTab, setStatusTab] = useState<'active' | 'resolved' | 'ALL'>('active');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'WARNING' | 'INFO'>('ALL');

  const resolvedCount = alerts.filter(a => a.status === 'resolved').length;
  const activeCount = alerts.filter(a => a.status !== 'resolved').length;

  const filteredAlerts = alerts.filter(a => {
    let matchesStatus = true;
    if (statusTab === 'active') {
      matchesStatus = a.status !== 'resolved';
    } else if (statusTab === 'resolved') {
      matchesStatus = a.status === 'resolved';
    }
    const matchesSeverity = severityFilter === 'ALL' || a.severity === severityFilter;
    return matchesStatus && matchesSeverity;
  });

  return (
    <div className="space-y-4 pb-20 text-left">
      {/* Top Banner */}
      <div className="bg-[#0f172a]/95 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-red-950 border border-red-800/60 flex items-center justify-center text-red-500 shrink-0 shadow">
            <Bell className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-display">
              {t('alerts_notifications')} & Early Warning Audit
            </h2>
            <p className="text-xs text-slate-400">
              Autonomous hazard detection with DGMS Safety Protocol Logging
            </p>
          </div>
        </div>

        {/* Siren status badge and control */}
        <div className="flex items-center space-x-3">
          <div className={`px-3 py-1.5 rounded-xl border text-xs font-mono-tech flex items-center space-x-2 ${
            sirenState.status === 'ACTIVE' 
              ? 'bg-red-950 border-red-700 text-red-300 animate-pulse' 
              : 'bg-slate-900 border-slate-700 text-slate-300'
          }`}>
            <span className={`w-2 h-2 rounded-full ${sirenState.status === 'ACTIVE' ? 'bg-red-500' : 'bg-slate-500'}`}></span>
            <span>SIREN: <strong>{sirenState.status}</strong> ({t('simulation_mode')})</span>
          </div>

          <button
            onClick={() => sirenState.status === 'ACTIVE' ? stopSiren() : triggerSiren('Auditory Alarm Test')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors ${
              sirenState.status === 'ACTIVE'
                ? 'bg-red-600 hover:bg-red-500 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            {sirenState.status === 'ACTIVE' ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{sirenState.status === 'ACTIVE' ? t('stop_siren') : t('test_siren')}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs - Active Notifications vs Alert History (Requirement 5) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0f172a]/95 border border-slate-800 rounded-2xl p-3">
        <div className="flex items-center space-x-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            id="tab-active-alerts"
            onClick={() => setStatusTab('active')}
            className={`px-3.5 py-1.5 rounded-lg font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
              statusTab === 'active'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Active Alerts</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono-tech ${
              activeCount > 0 ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              {activeCount}
            </span>
          </button>

          <button
            id="tab-alert-history"
            onClick={() => setStatusTab('resolved')}
            className={`px-3.5 py-1.5 rounded-lg font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
              statusTab === 'resolved'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Alert History (Resolved)</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono-tech bg-emerald-950 text-emerald-300 border border-emerald-800">
              {resolvedCount}
            </span>
          </button>

          <button
            id="tab-all-alerts"
            onClick={() => setStatusTab('ALL')}
            className={`px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider transition-all ${
              statusTab === 'ALL'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Events ({alerts.length})
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="WARNING">Warning</option>
            <option value="INFO">Info</option>
          </select>
        </div>
      </div>

      {/* Requirement 5 Notice when viewing Active list */}
      {statusTab === 'active' && activeCount === 0 && (
        <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-2xl p-6 text-center text-slate-300">
          <ShieldCheck className="w-9 h-9 text-emerald-400 mx-auto mb-2" />
          <h3 className="font-bold text-white text-sm">No Active Unresolved Alerts</h3>
          <p className="text-xs text-slate-400 mt-1">All triggered events have been resolved or mitigated. Resolved logs are preserved in Alert History.</p>
          <button
            onClick={() => setStatusTab('resolved')}
            className="mt-3 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
          >
            View Alert History ({resolvedCount} Records)
          </button>
        </div>
      )}

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 && statusTab !== 'active' ? (
          <div className="bg-[#0f172a]/80 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
            <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
            <p className="text-sm font-semibold text-slate-200">No records found in this view.</p>
            <p className="text-xs text-slate-500 mt-1">Ground stability conditions are within normal limits.</p>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const isCritical = alert.severity === 'CRITICAL' || alert.severity === 'HIGH';
            const isResolved = alert.status === 'resolved';

            return (
              <div
                key={alert.id}
                onClick={() => markAlertAsRead(alert.id)}
                className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isResolved
                    ? 'bg-slate-900/40 border-slate-800 opacity-80'
                    : isCritical
                    ? 'bg-red-950/25 border-red-900/60 shadow-lg shadow-red-950/20'
                    : 'bg-[#0f172a]/95 border-slate-800'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isResolved ? 'bg-emerald-950 border border-emerald-800 text-emerald-400' :
                    isCritical ? 'bg-red-950 border border-red-800 text-red-500' :
                    alert.severity === 'WARNING' ? 'bg-amber-950 border border-amber-800 text-amber-400' :
                    'bg-blue-950 border border-blue-800 text-cyan-400'
                  }`}>
                    {isResolved ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className={`w-5 h-5 ${isCritical ? 'animate-pulse' : ''}`} />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2.5 flex-wrap">
                      <h4 className="text-sm font-bold text-white">{alert.title}</h4>
                      <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold uppercase ${
                        isResolved ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        isCritical ? 'bg-red-950 text-red-400 border border-red-800' :
                        alert.severity === 'WARNING' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                        'bg-blue-950 text-cyan-400 border border-blue-800'
                      }`}>
                        {alert.severity}
                      </span>
                      {isResolved ? (
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-black bg-emerald-600 text-white uppercase tracking-wider">
                          RESOLVED
                        </span>
                      ) : (
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-black bg-red-600 text-white uppercase tracking-wider">
                          ACTIVE
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400 font-mono-tech flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{alert.timestamp}</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {alert.reason}
                    </p>

                    <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-2 font-mono-tech flex-wrap gap-y-1">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          openNodeDetails(alert.nodeId);
                        }}
                        className="text-cyan-400 hover:text-cyan-300 font-bold underline"
                      >
                        Node: {alert.nodeId}
                      </button>
                      <span>•</span>
                      <span>Zone: <strong className="text-slate-200">{alert.zone}</strong></span>
                      {alert.riskScore !== undefined && (
                        <>
                          <span>•</span>
                          <span className="font-bold text-amber-400">Score: {alert.riskScore}</span>
                        </>
                      )}
                      {alert.sensorSnapshot?.crack && (
                        <>
                          <span>•</span>
                          <span className="px-1.5 py-0.2 rounded bg-red-950 text-red-300 border border-red-800 text-[10px] font-bold">
                            CRACK TRIGGERED
                          </span>
                        </>
                      )}
                      {alert.resolvedBy && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-400">Resolved by: <strong>{alert.resolvedBy}</strong></span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center space-x-2 self-end md:self-center shrink-0">
                  <button
                    id={`page-inspect-node-${alert.nodeId}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      openNodeDetails(alert.nodeId);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
                  >
                    Inspect Node
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFocusedNodeId(alert.nodeId);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
                  >
                    Locate on Map
                  </button>

                  {alert.status === 'active' && (
                    <button
                      id={`page-ack-alert-${alert.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        acknowledgeAlert(alert.id);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white shadow transition-colors"
                    >
                      {t('acknowledge')}
                    </button>
                  )}

                  {alert.status !== 'resolved' && (
                    <button
                      id={`page-resolve-alert-${alert.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        resolveAlert(alert.id);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow transition-colors"
                      title="Resolves alert, immediately removing from Active and archiving to Alert History"
                    >
                      {t('resolve')}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
