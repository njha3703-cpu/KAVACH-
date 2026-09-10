import React from 'react';
import { useKavachData } from '../../hooks/useKavachData';
import { 
  Radio, 
  MapPin, 
  Battery, 
  Wifi, 
  ShieldAlert, 
  X, 
  Activity, 
  Compass, 
  ArrowUpRight, 
  Gauge, 
  Waves, 
  Maximize2 
} from 'lucide-react';

/**
 * Universal Dynamic Node Details Inspection Modal
 * Requirements 17, 19, 20:
 * - Opens dynamically when ANY node is clicked (Normal, Warning, High Risk, Critical, Offline)
 * - Shows dedicated data for every single node: NODE_01 to NODE_N
 * - Displays all four primary sensors:
 *    1. Tilt (MPU6050)
 *    2. Vibration (SW-420)
 *    3. Displacement (VL53L0X)
 *    4. Crack Sensor (Conductive/Copper Tape)
 * - Shows Node ID, Location, Status, Battery, Connectivity, Last Updated, Risk Level, Risk Score
 */
export const NodeInspectionModal: React.FC = () => {
  const { inspectingNode, setInspectingNode, setFocusedNodeId } = useKavachData();

  if (!inspectingNode) return null;

  const node = inspectingNode;

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-red-950 text-red-300 border-red-800 animate-pulse';
      case 'HIGH':
        return 'bg-orange-950 text-orange-300 border-orange-800';
      case 'WARNING':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      default:
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Critical':
        return 'bg-red-600 text-white';
      case 'Warning':
        return 'bg-amber-600 text-white';
      case 'Offline':
        return 'bg-slate-700 text-slate-300';
      default:
        return 'bg-emerald-600 text-white';
    }
  };

  return (
    <div 
      id="node-inspection-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div 
        id={`node-inspection-card-${node.id}`}
        className="w-full max-w-xl rounded-2xl bg-[#090e1a] border border-slate-700 shadow-2xl overflow-hidden text-left text-slate-100"
      >
        {/* Header */}
        <div className="bg-[#0e172a] border-b border-slate-800 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg shadow ${
              node.riskLevel === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' :
              node.riskLevel === 'WARNING' || node.riskLevel === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
              'bg-blue-950 text-cyan-400 border border-blue-800'
            }`}>
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-black text-white font-mono-tech tracking-wide">
                  {node.id}
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(node.status)}`}>
                  {node.status}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getRiskBadge(node.riskLevel)}`}>
                  {node.riskLevel}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{node.location.zone}</span>
                <span>•</span>
                <span className="font-mono-tech text-[11px]">Lat {node.location.latitude.toFixed(4)}, Lon {node.location.longitude.toFixed(4)}</span>
              </p>
            </div>
          </div>

          <button
            id="close-node-modal-btn"
            onClick={() => setInspectingNode(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close Details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Risk Score & Battery Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-[#0e172a] border border-slate-800 rounded-xl p-3 text-center">
              <span className="text-[10px] text-slate-400 font-mono-tech uppercase block">Risk Score</span>
              <span className={`text-2xl font-black font-mono-tech ${
                node.riskScore > 75 ? 'text-red-400' : node.riskScore > 40 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {node.riskScore}/100
              </span>
            </div>

            <div className="bg-[#0e172a] border border-slate-800 rounded-xl p-3 text-center">
              <span className="text-[10px] text-slate-400 font-mono-tech uppercase block">Battery</span>
              <div className="flex items-center justify-center space-x-1 mt-1 text-slate-200">
                <Battery className={`w-4 h-4 ${node.battery < 20 ? 'text-red-400' : node.battery < 50 ? 'text-amber-400' : 'text-emerald-400'}`} />
                <span className="text-lg font-bold font-mono-tech">{node.battery}%</span>
              </div>
            </div>

            <div className="bg-[#0e172a] border border-slate-800 rounded-xl p-3 text-center">
              <span className="text-[10px] text-slate-400 font-mono-tech uppercase block">Connectivity</span>
              <div className="flex items-center justify-center space-x-1 mt-1 text-cyan-400">
                <Wifi className="w-4 h-4" />
                <span className="text-xs font-bold font-mono-tech">{node.connectivity}</span>
              </div>
            </div>

            <div className="bg-[#0e172a] border border-slate-800 rounded-xl p-3 text-center">
              <span className="text-[10px] text-slate-400 font-mono-tech uppercase block">Last Updated</span>
              <span className="text-xs font-medium text-slate-300 block mt-1">
                {node.lastUpdated || 'Real-time'}
              </span>
            </div>
          </div>

          {/* ALL FOUR SENSORS SECTION (Requirements 13, 14, 15, 16, 17) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono-tech">
                Primary Multi-Sensor Suite (4 Transducers)
              </span>
              <span className="text-[10px] text-slate-500 font-mono-tech">
                Continuous Telemetry Feed
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* SENSOR 1: Tilt (MPU6050) */}
              <div className="bg-[#0e172a] border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Gauge className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white">1. Tilt Sensor (MPU6050)</span>
                  </div>
                  <span className={`text-[10px] font-mono-tech font-semibold ${
                    node.rateOfChange?.tiltTrend === 'increasing' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {node.rateOfChange?.tiltTrend === 'increasing' ? '↑ Rising' : '→ Stable'}
                  </span>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-black text-white font-mono-tech">
                    {node.sensors.tiltMagnitude}°
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono-tech">
                    X: {node.sensors.tiltX}° | Y: {node.sensors.tiltY}°
                  </span>
                </div>
              </div>

              {/* SENSOR 2: Vibration (SW-420) */}
              <div className="bg-[#0e172a] border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Waves className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-white">2. Vibration Sensor (SW-420)</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono-tech">
                    PPV Seismic
                  </span>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-black text-white font-mono-tech">
                      {node.sensors.vibration}
                    </span>
                    <span className="text-xs text-slate-400 font-mono-tech">mm/s</span>
                  </div>
                  <span className={`text-[10px] font-mono-tech ${node.sensors.vibration > 2.0 ? 'text-red-400 font-bold' : 'text-slate-400'}`}>
                    {node.sensors.vibration > 2.0 ? 'Exceeds DGMS Limit' : 'Within Threshold'}
                  </span>
                </div>
              </div>

              {/* SENSOR 3: Displacement (VL53L0X) */}
              <div className="bg-[#0e172a] border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Maximize2 className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-white">3. Displacement Sensor (VL53L0X)</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono-tech">
                    Laser Distance
                  </span>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-black text-white font-mono-tech">
                      {node.sensors.displacement}
                    </span>
                    <span className="text-xs text-slate-400 font-mono-tech">mm</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono-tech">
                    Surface Settlement
                  </span>
                </div>
              </div>

              {/* SENSOR 4: Crack Sensor (Conductive/Copper Tape) */}
              <div className={`border rounded-xl p-3.5 flex flex-col justify-between ${
                node.sensors.crack 
                  ? 'bg-red-950/40 border-red-800' 
                  : 'bg-[#0e172a] border-slate-800'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className={`w-4 h-4 ${node.sensors.crack ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`} />
                    <span className="text-xs font-bold text-white">4. Crack Sensor</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono-tech">
                    Conductive Tape
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-black tracking-wider uppercase ${
                    node.sensors.crack
                      ? 'bg-red-950 text-red-300 border border-red-700 animate-pulse'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {node.sensors.crack ? 'CRACK DETECTED' : 'NO CRACK DETECTED'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono-tech">
                    {node.sensors.crack ? 'Fracture Open' : 'Circuit Closed'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Elevation & Geodetic Data */}
          <div className="bg-[#0b1020] border border-slate-800/80 rounded-xl p-3 text-xs text-slate-400 font-mono-tech flex flex-wrap items-center justify-between gap-2">
            <div>Zone: <strong className="text-slate-200">{node.location.zone}</strong></div>
            <div>Elevation: <strong className="text-slate-200">{node.location.elevation || 142} m AMSL</strong></div>
            <div>Protocol: <strong className="text-slate-200">ESP-NOW / LoRa 868MHz</strong></div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#0e172a] border-t border-slate-800 px-5 py-3.5 flex items-center justify-between">
          <button
            onClick={() => {
              setFocusedNodeId(node.id);
              setInspectingNode(null);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Focus on Map</span>
          </button>

          <button
            onClick={() => setInspectingNode(null)}
            className="px-4 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold transition-colors shadow"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
