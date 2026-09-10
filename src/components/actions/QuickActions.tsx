import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useKavachData } from '../../hooks/useKavachData';
import { 
  Map, 
  Download, 
  Check, 
  Volume2, 
  VolumeX, 
  AlertOctagon,
  AlertTriangle,
  Flame,
  Radio
} from 'lucide-react';

export const QuickActions: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { 
    triggerSiren, 
    stopSiren, 
    sirenState, 
    triggerEmergencyEvacuation, 
    nodes, 
    simulateWarning,
    simulateHighRisk,
    simulateCriticalAlert
  } = useKavachData();

  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  // Generate & Download Telemetry CSV Report
  const handleDownloadCsv = () => {
    const headers = [
      'Node ID',
      'Zone',
      'Latitude',
      'Longitude',
      'Status',
      'Tilt (°)',
      'Vibration (mm/s)',
      'Displacement (mm)',
      'Crack Detected',
      'Battery (%)',
      'Connectivity',
      'Risk Score',
      'Risk Level',
    ];

    const rows = nodes.map(n => [
      n.id,
      n.location.zone,
      n.location.latitude,
      n.location.longitude,
      n.status,
      n.sensors.tiltMagnitude,
      n.sensors.vibration,
      n.sensors.displacement,
      n.sensors.crack ? 'YES' : 'NO',
      n.battery,
      n.connectivity,
      n.riskScore,
      n.riskLevel,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `KAVACH_Mine_Subsidence_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setReportSuccess(true);
    setTimeout(() => setReportSuccess(false), 3000);
  };

  return (
    <div className="bg-[#0f172a]/95 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm h-[320px]">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-2 flex items-center justify-between text-left">
        <h3 className="text-sm font-bold text-white tracking-wide">
          {t('quick_actions')}
        </h3>
        <span className="text-[10px] text-cyan-400 font-mono-tech px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">
          Mine Safety Controls
        </span>
      </div>

      {/* 4 Action Buttons */}
      <div className="space-y-2 my-1">
        {/* 1. View Full Map & Download Row */}
        <div className="grid grid-cols-2 gap-2">
          <button
            id="action-btn-view-map"
            onClick={() => navigate('/live-map')}
            className="p-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/60 hover:border-emerald-600/80 transition-all flex items-center space-x-2 text-left group"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow">
              <Map className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                {t('view_full_map')}
              </p>
              <p className="text-[9px] text-slate-400 truncate">GIS & Seams</p>
            </div>
          </button>

          <button
            id="action-btn-download-report"
            onClick={handleDownloadCsv}
            className="p-2 rounded-xl bg-blue-950/40 hover:bg-blue-900/50 border border-blue-800/60 hover:border-blue-600/80 transition-all flex items-center space-x-2 text-left group"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow">
              {reportSuccess ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-white group-hover:text-blue-300 transition-colors truncate">
                {reportSuccess ? 'Exported!' : t('download_report')}
              </p>
              <p className="text-[9px] text-slate-400 truncate">CSV Data</p>
            </div>
          </button>
        </div>

        {/* 2. Simulation Controls (Requirements 9 & 10) */}
        <div className="grid grid-cols-2 gap-2">
          {/* SIMULATE WARNING */}
          <button
            id="action-btn-simulate-warning"
            onClick={simulateWarning}
            className="p-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/60 hover:border-amber-600/80 transition-all flex items-center space-x-2 text-left group"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-600 flex items-center justify-center text-white shrink-0 shadow">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-amber-300 group-hover:text-amber-200 transition-colors truncate">
                Simulate Warning
              </p>
              <p className="text-[9px] text-slate-400 truncate">Tilt Escalation</p>
            </div>
          </button>

          {/* SIMULATE HIGH RISK */}
          <button
            id="action-btn-simulate-high-risk"
            onClick={simulateHighRisk}
            className="p-2 rounded-xl bg-orange-950/40 hover:bg-orange-900/50 border border-orange-800/60 hover:border-orange-600/80 transition-all flex items-center space-x-2 text-left group"
          >
            <div className="w-7 h-7 rounded-lg bg-orange-600 flex items-center justify-center text-white shrink-0 shadow">
              <AlertOctagon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-orange-300 group-hover:text-orange-200 transition-colors truncate">
                Simulate High Risk
              </p>
              <p className="text-[9px] text-slate-400 truncate">Seismic Surge</p>
            </div>
          </button>
        </div>

        {/* 3. SIMULATE CRITICAL ALERT + IMMEDIATE SIREN (Requirement 11) */}
        <button
          id="action-btn-simulate-critical"
          onClick={simulateCriticalAlert}
          className="w-full p-2.5 rounded-xl bg-red-950/60 hover:bg-red-900/70 border-2 border-red-600/80 hover:border-red-500 transition-all flex items-center space-x-3 text-left group shadow-md shadow-red-950/40"
        >
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white shrink-0 shadow animate-pulse">
            <Flame className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-black text-red-200 group-hover:text-white uppercase tracking-wider transition-colors">
                SIMULATE CRITICAL ALERT
              </p>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-900/80 text-red-200 font-mono-tech">
                AUTO-SIREN
              </span>
            </div>
            <p className="text-[10px] text-red-300/80 truncate">Triggers Node 27 • Popup • Immediate Siren</p>
          </div>
        </button>
      </div>

      {/* Control Room Siren & Emergency Bar (Requirements 14 & 15: TEST SIREN / STOP SIREN - NO MUTE) */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <button
          id="action-toggle-siren-btn"
          onClick={() => sirenState.status === 'ACTIVE' ? stopSiren() : triggerSiren('Operator Manual Push')}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
            sirenState.status === 'ACTIVE'
              ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse shadow-lg shadow-red-950'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
        >
          {sirenState.status === 'ACTIVE' ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          <span>{sirenState.status === 'ACTIVE' ? t('stop_siren') : t('test_siren')}</span>
        </button>

        <button
          id="action-emergency-evacuate-btn"
          onClick={() => setEmergencyModalOpen(true)}
          className="py-1.5 px-2.5 rounded-xl bg-red-950 hover:bg-red-900 border border-red-800 text-red-400 text-xs font-bold flex items-center space-x-1"
          title="Trigger Emergency Protocol"
        >
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>Evacuate</span>
        </button>
      </div>

      {/* Emergency Confirmation Dialog */}
      {emergencyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e1419] border-2 border-red-500 rounded-2xl w-full max-w-md p-5 text-left text-white shadow-2xl">
            <div className="flex items-center space-x-3 text-red-500 mb-3">
              <AlertOctagon className="w-8 h-8 animate-bounce" />
              <div>
                <h3 className="text-base font-black font-display uppercase tracking-wider">
                  {t('emergency_confirm')}
                </h3>
                <p className="text-xs text-red-300">Level-4 Mine Hazard Directive</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-red-950/40 p-3 rounded-xl border border-red-900/60 leading-relaxed mb-4">
              {t('emergency_warning')}
            </p>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setEmergencyModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                id="confirm-emergency-btn"
                onClick={() => {
                  triggerEmergencyEvacuation();
                  setEmergencyModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white shadow-lg shadow-red-950 animate-pulse"
              >
                EXECUTE EVACUATION
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
