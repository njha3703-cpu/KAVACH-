import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useKavachData } from '../../hooks/useKavachData';
import { 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Flame, 
  VolumeX, 
  Check, 
  X, 
  Compass, 
  Activity, 
  ShieldAlert 
} from 'lucide-react';

/**
 * Global Critical Alert Modal (Requirement 4)
 * Immediately pops up when a critical subsidence hazard is detected.
 * Displays: Node ID, Location, Reason, Risk Score, Timestamp, Sensor Snapshot.
 * Keeps siren control intact.
 */
export const CriticalAlertModal: React.FC = () => {
  const { 
    criticalPopupAlert, 
    dismissCriticalPopup, 
    sirenState, 
    stopSiren, 
    openNodeDetails, 
    acknowledgeAlert 
  } = useKavachData();

  const navigate = useNavigate();

  if (!criticalPopupAlert) return null;

  const alert = criticalPopupAlert;

  const handleLocateOnMap = () => {
    if (alert.nodeId) {
      openNodeDetails(alert.nodeId);
    }
    dismissCriticalPopup();
    navigate('/live-map');
  };

  const handleAcknowledge = () => {
    acknowledgeAlert(alert.id);
    dismissCriticalPopup();
  };

  return (
    <div 
      id="critical-alert-popup-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div 
        id="critical-alert-modal-container"
        className="w-full max-w-xl rounded-2xl bg-[#090e1a] border-2 border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.45)] overflow-hidden text-left text-slate-100"
      >
        {/* Emergency Header Bar */}
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-800 px-5 py-3.5 flex items-center justify-between text-white shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0 animate-bounce">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono-tech tracking-widest text-red-200 block">
                Official DGMS Early Warning
              </span>
              <h2 className="text-base sm:text-lg font-black tracking-wide font-display uppercase">
                CRITICAL SUBSIDENCE ALERT
              </h2>
            </div>
          </div>
          <button
            id="dismiss-critical-popup-btn"
            onClick={dismissCriticalPopup}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            title="Dismiss Popup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Siren Status Banner */}
        {sirenState.status === 'ACTIVE' && (
          <div className="bg-red-950/90 border-b border-red-800/80 px-5 py-2.5 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-red-300 text-xs font-bold">
              <Flame className="w-4 h-4 text-red-400 animate-pulse" />
              <span>EVACUATION SIREN ACTIVE — {sirenState.reason || 'Critical hazard'}</span>
            </div>
            <button
              id="critical-popup-stop-siren-btn"
              onClick={stopSiren}
              className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 transition-colors shadow"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>Stop Siren</span>
            </button>
          </div>
        )}

        {/* Main Content Body */}
        <div className="p-5 space-y-4">
          {/* Node and Risk Score Row */}
          <div className="flex items-start justify-between gap-3 bg-[#0e172a] border border-slate-800 rounded-xl p-4">
            <div>
              <span className="text-[10px] text-slate-400 font-mono-tech uppercase tracking-wider">Affected Sensor Node</span>
              <h3 className="text-xl font-black text-white font-mono-tech">
                {alert.nodeLabel || alert.nodeId}
              </h3>
              <div className="flex items-center space-x-2 text-xs text-slate-300 mt-1">
                <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>{alert.zone || 'Mining Perimeter Zone'}</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono-tech mt-0.5">
                Coordinates: Lat {alert.latitude.toFixed(4)}, Lon {alert.longitude.toFixed(4)}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-mono-tech uppercase tracking-wider">Risk Score</span>
              <div className="flex items-baseline justify-end space-x-1">
                <span className="text-3xl font-black text-red-400 font-mono-tech">
                  {alert.riskScore}
                </span>
                <span className="text-xs text-slate-400">/100</span>
              </div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-950 text-red-300 border border-red-800 uppercase tracking-wider mt-1">
                CRITICAL HAZARD
              </span>
            </div>
          </div>

          {/* Reason Card */}
          <div className="bg-[#0e172a] border border-slate-800 rounded-xl p-3.5">
            <span className="text-[10px] text-slate-400 uppercase font-mono-tech tracking-wider">Hazard Description & Trigger Reason</span>
            <p className="text-sm font-semibold text-slate-100 mt-1 leading-relaxed">
              {alert.reason}
            </p>
            <div className="flex items-center space-x-1.5 text-xs text-slate-400 mt-2 font-mono-tech">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Timestamp: <strong>{alert.timestamp}</strong></span>
            </div>
          </div>

          {/* Snapshot of 4 Sensors */}
          {alert.sensorSnapshot && (
            <div>
              <span className="text-[10px] text-slate-400 font-mono-tech uppercase tracking-wider block mb-1.5">
                Breach Sensor Telemetry Snapshot
              </span>
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 text-center">
                  <span className="text-[10px] text-slate-400 block">Tilt (MPU6050)</span>
                  <span className="text-sm font-bold text-red-400 font-mono-tech">
                    {alert.sensorSnapshot.tiltMagnitude ?? 0}°
                  </span>
                </div>
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 text-center">
                  <span className="text-[10px] text-slate-400 block">Vibration (SW-420)</span>
                  <span className="text-sm font-bold text-red-400 font-mono-tech">
                    {alert.sensorSnapshot.vibration ?? 0} mm/s
                  </span>
                </div>
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 text-center">
                  <span className="text-[10px] text-slate-400 block">Displacement</span>
                  <span className="text-sm font-bold text-red-400 font-mono-tech">
                    {alert.sensorSnapshot.displacement ?? 0} mm
                  </span>
                </div>
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 text-center">
                  <span className="text-[10px] text-slate-400 block">Crack Sensor</span>
                  <span className={`text-[11px] font-bold block ${alert.sensorSnapshot.crack ? 'text-red-400' : 'text-emerald-400'}`}>
                    {alert.sensorSnapshot.crack ? 'CRACK DETECTED' : 'NO CRACK'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons Footer */}
        <div className="bg-[#0b1020] border-t border-slate-800 px-5 py-3.5 flex items-center justify-between gap-3">
          <button
            id="critical-popup-locate-btn"
            onClick={handleLocateOnMap}
            className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold flex items-center space-x-2 transition-colors shadow"
          >
            <Compass className="w-4 h-4" />
            <span>Locate on Map</span>
          </button>

          <div className="flex items-center space-x-2.5">
            <button
              id="critical-popup-ack-btn"
              onClick={handleAcknowledge}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors shadow"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Acknowledge Alert</span>
            </button>
            <button
              id="critical-popup-close-btn"
              onClick={dismissCriticalPopup}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
