import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useKavachData } from '../hooks/useKavachData';
import { audioSynthesizer } from '../services/audioAlert';
import { 
  Settings, 
  Sliders, 
  Volume2, 
  VolumeX, 
  Radio, 
  Cloud, 
  Check, 
  ShieldAlert 
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { t } = useLanguage();
  const { thresholds, setThresholds, triggerSiren, stopSiren, sirenState } = useKavachData();

  const [tiltWarning, setTiltWarning] = useState(thresholds.tiltWarning);
  const [tiltCritical, setTiltCritical] = useState(thresholds.tiltCritical);
  const [vibWarning, setVibWarning] = useState(thresholds.vibrationWarning);
  const [vibCritical, setVibCritical] = useState(thresholds.vibrationCritical);
  const [dispWarning, setDispWarning] = useState(thresholds.displacementWarning);
  const [dispCritical, setDispCritical] = useState(thresholds.displacementCritical);

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveThresholds = () => {
    setThresholds({
      tiltWarning: Number(tiltWarning),
      tiltCritical: Number(tiltCritical),
      vibrationWarning: Number(vibWarning),
      vibrationCritical: Number(vibCritical),
      displacementWarning: Number(dispWarning),
      displacementCritical: Number(dispCritical),
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-4 pb-20 text-left">
      {/* Top Banner */}
      <div className="bg-[#0f172a]/95 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 shadow">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-display">
              {t('settings')} & Hardware Calibration
            </h2>
            <p className="text-xs text-slate-400">
              Sensor Trigger Thresholds • Siren Simulation • LoRa Gateway Configuration
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sensor Thresholds Card */}
        <div className="bg-[#0f172a]/95 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white font-display">
              Autonomous Trigger Thresholds
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            {/* Tilt */}
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-2">
              <label className="font-semibold text-slate-200 block">Ground Tilt Angle (° Degrees):</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-amber-400 block mb-1">Warning Threshold (Default: 1.0°)</span>
                  <input
                    type="number"
                    step="0.1"
                    value={tiltWarning}
                    onChange={(e) => setTiltWarning(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono-tech"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-red-400 block mb-1">Critical Evac Threshold (Default: 2.0°)</span>
                  <input
                    type="number"
                    step="0.1"
                    value={tiltCritical}
                    onChange={(e) => setTiltCritical(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono-tech"
                  />
                </div>
              </div>
            </div>

            {/* Vibration */}
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-2">
              <label className="font-semibold text-slate-200 block">Peak Particle Vibration (mm/s):</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-amber-400 block mb-1">Warning Threshold (Default: 1.5 mm/s)</span>
                  <input
                    type="number"
                    step="0.1"
                    value={vibWarning}
                    onChange={(e) => setVibWarning(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono-tech"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-red-400 block mb-1">Critical Threshold (Default: 2.5 mm/s)</span>
                  <input
                    type="number"
                    step="0.1"
                    value={vibCritical}
                    onChange={(e) => setVibCritical(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono-tech"
                  />
                </div>
              </div>
            </div>

            {/* Displacement */}
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-2">
              <label className="font-semibold text-slate-200 block">Surface Displacement (mm):</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-amber-400 block mb-1">Warning Threshold (Default: 2.0 mm)</span>
                  <input
                    type="number"
                    step="0.1"
                    value={dispWarning}
                    onChange={(e) => setDispWarning(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono-tech"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-red-400 block mb-1">Critical Threshold (Default: 3.5 mm)</span>
                  <input
                    type="number"
                    step="0.1"
                    value={dispCritical}
                    onChange={(e) => setDispCritical(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono-tech"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveThresholds}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-colors shadow"
            >
              {saveSuccess ? <Check className="w-4 h-4" /> : <Sliders className="w-4 h-4" />}
              <span>{saveSuccess ? 'Thresholds Saved!' : 'Save New Thresholds'}</span>
            </button>
          </div>
        </div>

        {/* Siren & Gateway Settings */}
        <div className="space-y-4">
          {/* Siren Hardware Simulation */}
          <div className="bg-[#0f172a]/95 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-red-500" />
                <h3 className="text-sm font-bold text-white font-display">
                  Auditory Siren Simulator (Web Audio API)
                </h3>
              </div>
              <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-red-950 border border-red-800 text-red-300">
                {sirenState.status}
              </span>
            </div>

            <p className="text-xs text-slate-400">
              In accordance with mine safety standards, the siren triggers when an automated Critical event occurs or via manual operator actuation.
            </p>

            <div className="pt-2">
              <button
                onClick={() => sirenState.status === 'ACTIVE' ? stopSiren() : triggerSiren('Settings manual test')}
                className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                  sirenState.status === 'ACTIVE'
                    ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                {sirenState.status === 'ACTIVE' ? t('stop_siren') : t('test_siren')}
              </button>
            </div>
          </div>

          {/* ESP-NOW Hardware Gateway */}
          <div className="bg-[#0f172a]/95 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Radio className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white font-display">
                ESP-NOW Gateway Network Configuration
              </h3>
            </div>

            <div className="space-y-2 text-xs font-mono-tech text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Communication Protocol:</span>
                <span className="text-cyan-400">ESP-NOW (2.4 GHz Direct MAC)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Gateway Topology:</span>
                <span>Node-to-Gateway Direct Star</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Base Station IP:</span>
                <span>192.168.1.120 (ESP32 Station Mode)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Actuator Command Path:</span>
                <span className="text-emerald-400">commands/gateway/buzzer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
