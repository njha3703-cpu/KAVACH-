import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useKavachData } from '../hooks/useKavachData';
import { SensorNode } from '../types';
import { 
  Radio, 
  Search, 
  SlidersHorizontal, 
  Download, 
  Terminal, 
  Send, 
  Check, 
  Battery, 
  Wifi, 
  AlertTriangle 
} from 'lucide-react';

export const SensorDataPage: React.FC = () => {
  const { t } = useLanguage();
  const { nodes, setFocusedNodeId, openNodeDetails, ingestEsp32Telemetry } = useKavachData();

  const [searchTerm, setSearchTerm] = useState('');
  const [zoneFilter, setZoneFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // ESP32 Telemetry Simulation State
  const [esp32Payload, setEsp32Payload] = useState(
    JSON.stringify(
      {
        node_id: 'NODE_27',
        tilt_x: 2.15,
        tilt_y: 1.85,
        vibration: 2.65,
        displacement: 3.42,
        crack: true,
        battery: 89,
      },
      null,
      2
    )
  );
  const [ingestStatus, setIngestStatus] = useState<string | null>(null);

  const filteredNodes = nodes.filter(node => {
    const matchesSearch =
      node.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.location.zone.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesZone = zoneFilter === 'ALL' || node.location.zone === zoneFilter;
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'HIGH_RISK' && (node.riskLevel === 'CRITICAL' || node.isHighRisk)) ||
      (statusFilter === 'WARNING' && node.riskLevel === 'WARNING') ||
      (statusFilter === 'NORMAL' && node.riskLevel === 'NORMAL') ||
      (statusFilter === 'OFFLINE' && node.status === 'Offline');

    return matchesSearch && matchesZone && matchesStatus;
  });

  const zones = Array.from(new Set(nodes.map(n => n.location.zone)));

  const handleSimulateIngest = () => {
    try {
      const parsed = JSON.parse(esp32Payload);
      ingestEsp32Telemetry(parsed);
      setIngestStatus(`Payload accepted for ${parsed.node_id}! Node telemetry updated.`);
      setTimeout(() => setIngestStatus(null), 4000);
    } catch (e: any) {
      setIngestStatus(`Error parsing JSON: ${e.message}`);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Header */}
      <div className="bg-[#0f172a]/95 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm text-left">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400 shrink-0 shadow">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-display">
              {t('sensor_data')} & Telemetry Console
            </h2>
            <p className="text-xs text-slate-400">
              LoRaWAN 865-867 MHz (India band) Wireless Surface Ground Mesh Network
            </p>
          </div>
        </div>

        {/* Quick Summary Badges */}
        <div className="flex items-center space-x-2 text-xs font-mono-tech">
          <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
            Total: <strong>{nodes.length}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300">
            Online: <strong>{nodes.filter(n => n.status !== 'Offline').length}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-red-950/80 border border-red-800 text-red-300">
            High Risk: <strong>{nodes.filter(n => n.isHighRisk || n.riskLevel === 'CRITICAL').length}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0f172a]/95 border border-slate-800 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Node ID, Zone, or Status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Zones</option>
            {zones.map(z => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="HIGH_RISK">High Risk / Critical</option>
            <option value="WARNING">Warning</option>
            <option value="NORMAL">Normal</option>
            <option value="OFFLINE">Offline</option>
          </select>
        </div>
      </div>

      {/* Full Telemetry Table */}
      <div className="bg-[#0f172a]/95 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-mono-tech">
                <th className="py-3 px-3.5">Node ID</th>
                <th className="py-3 px-3.5">Zone</th>
                <th className="py-3 px-3.5">Node Location (Lat / Lon)</th>
                <th className="py-3 px-3.5">Status</th>
                <th className="py-3 px-3.5">Tilt (°)</th>
                <th className="py-3 px-3.5">Vibration (mm/s)</th>
                <th className="py-3 px-3.5">Displacement (mm)</th>
                <th className="py-3 px-3.5">Crack Sensor</th>
                <th className="py-3 px-3.5">Battery</th>
                <th className="py-3 px-3.5">Signal</th>
                <th className="py-3 px-3.5">Risk Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono-tech">
              {filteredNodes.map(node => {
                const isCritical = node.riskLevel === 'CRITICAL' || node.isHighRisk;
                const isWarning = node.riskLevel === 'WARNING';

                return (
                  <tr
                    key={node.id}
                    id={`sensor-data-row-${node.id}`}
                    onClick={() => openNodeDetails(node)}
                    className={`hover:bg-slate-850 cursor-pointer transition-colors ${
                      isCritical ? 'bg-red-950/20' : isWarning ? 'bg-amber-950/15' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3.5 font-bold text-white flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${isCritical ? 'bg-red-500 animate-ping' : isWarning ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                      <span>{node.label}</span>
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-300 font-sans">{node.location.zone}</td>
                    <td className="py-2.5 px-3.5 text-slate-400 text-[11px]">
                      {node.location.latitude.toFixed(4)}, {node.location.longitude.toFixed(4)}
                    </td>
                    <td className="py-2.5 px-3.5 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        isCritical ? 'bg-red-950 text-red-400 border border-red-800' :
                        isWarning ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                        node.status === 'Offline' ? 'bg-slate-800 text-slate-400' :
                        'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}>
                        {node.status}
                      </span>
                    </td>
                    <td className={`py-2.5 px-3.5 font-bold ${node.sensors.tiltMagnitude > 1.5 ? 'text-red-400' : 'text-slate-200'}`}>
                      {node.sensors.tiltMagnitude.toFixed(2)}°
                    </td>
                    <td className={`py-2.5 px-3.5 font-bold ${node.sensors.vibration > 2.0 ? 'text-red-400' : 'text-slate-200'}`}>
                      {node.sensors.vibration.toFixed(2)}
                    </td>
                    <td className={`py-2.5 px-3.5 font-bold ${node.sensors.displacement > 2.0 ? 'text-red-400' : 'text-slate-200'}`}>
                      {node.sensors.displacement.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        node.sensors.crack ? 'bg-red-950 text-red-300 border border-red-800 animate-pulse' : 'bg-slate-900 text-slate-400'
                      }`}>
                        {node.sensors.crack ? 'TRIGGERED' : 'NORMAL'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-300">
                      <div className="flex items-center space-x-1">
                        <Battery className="w-3.5 h-3.5 text-slate-400" />
                        <span>{node.battery}%</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-400 text-[11px]">
                      {node.connectivity}
                    </td>
                    <td className={`py-2.5 px-3.5 font-bold ${isCritical ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {node.riskScore}/100
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* HARDWARE INGESTION LAYER (ESP32 Integration Console) */}
      <div className="bg-[#0f172a]/95 border border-slate-800 rounded-2xl p-4 shadow-sm text-left">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
          <div className="flex items-center space-x-2.5">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-white font-display">
                ESP32 Hardware Ingestion Layer & LoRa Gateway Packet Receiver
              </h3>
              <p className="text-xs text-slate-400">
                Direct REST/MQTT telemetry endpoint: <code className="text-cyan-400">POST /api/telemetry/ingest</code>
              </p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 font-mono-tech">
            Gateway Listening
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Live JSON Ingestion Payload:
            </label>
            <textarea
              rows={8}
              value={esp32Payload}
              onChange={(e) => setEsp32Payload(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono-tech text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex flex-col justify-between">
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
              <p className="font-semibold text-white">Hardware Integration Notice:</p>
              <p className="text-[11px] text-slate-400">
                KAVACH nodes use low-power ESP32 microcontrollers paired with MPU6050 (tilt angle), SW-420 (piezoelectric vibration), ultrasonic/LVDT displacement, and optical crack transducers.
              </p>
              <p className="text-[11px] text-slate-400">
                You can edit the JSON payload on the left (e.g. modify tilt or set crack to true) and hit <strong>Inject Telemetry</strong> to test how the entire system reacts immediately!
              </p>
              {ingestStatus && (
                <div className="p-2 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-300 font-mono-tech text-[11px] flex items-center space-x-1.5 animate-in fade-in">
                  <Check className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{ingestStatus}</span>
                </div>
              )}
            </div>

            <button
              id="inject-esp32-telemetry-btn"
              onClick={handleSimulateIngest}
              className="w-full mt-3 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-colors shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>INJECT TELEMETRY INTO PIPELINE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
