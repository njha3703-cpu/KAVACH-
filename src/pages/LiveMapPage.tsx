import React, { useState } from 'react';
import { LiveGisMap } from '../components/map/LiveGisMap';
import { useLanguage } from '../hooks/useLanguage';
import { useKavachData } from '../hooks/useKavachData';
import { SensorNode } from '../types';
import { 
  Radio, 
  MapPin, 
  Compass, 
  Layers, 
  AlertTriangle, 
  Activity, 
  ArrowLeftRight, 
  Battery, 
  Wifi, 
  X,
  SlidersHorizontal,
  Flame
} from 'lucide-react';

export const LiveMapPage: React.FC = () => {
  const { t } = useLanguage();
  const { nodes, focusedNodeId, setFocusedNodeId } = useKavachData();
  const [selectedNode, setSelectedNode] = useState<SensorNode | null>(null);
  const [filterRisk, setFilterRisk] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'NORMAL'>('ALL');

  const filteredNodes = nodes.filter(n => {
    if (filterRisk === 'ALL') return true;
    return n.riskLevel === filterRisk;
  });

  const activeNode = selectedNode || nodes.find(n => n.id === focusedNodeId) || nodes[0];

  return (
    <div className="space-y-4 pb-20">
      {/* Top Header & Filter Controls */}
      <div className="bg-[#0f172a]/95 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center space-x-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-800/60 flex items-center justify-center text-cyan-400 shrink-0 shadow">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-display">
              {t('live_map')} – GIS Geotechnical Spatial Mesh
            </h2>
            <p className="text-xs text-slate-400">
              Jharia Underground Coalfield Seam #XI & Surface Displacements
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            {(['ALL', 'CRITICAL', 'WARNING', 'NORMAL'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilterRisk(f)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  filterRisk === f
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Map & Node Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 xl:col-span-9">
          <LiveGisMap 
            fullHeight={true} 
            onSelectNode={(node) => setSelectedNode(node)} 
          />
        </div>

        {/* Selected Node Detailed Sidebar */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-4">
          <div className="bg-[#0f172a]/95 border border-slate-800 rounded-2xl p-4 shadow-sm text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center space-x-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  activeNode.riskLevel === 'CRITICAL' ? 'bg-red-950 text-red-400' :
                  activeNode.riskLevel === 'WARNING' ? 'bg-amber-950 text-amber-400' : 'bg-emerald-950 text-emerald-400'
                }`}>
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-display">
                    {activeNode.label}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono-tech">
                    Zone: {activeNode.location.zone}
                  </span>
                </div>
              </div>

              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeNode.riskLevel === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' :
                activeNode.riskLevel === 'WARNING' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                'bg-emerald-950 text-emerald-400 border border-emerald-800'
              }`}>
                {activeNode.riskLevel}
              </span>
            </div>

            {/* Coordinates notice */}
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 mb-3 text-xs font-mono-tech text-slate-300">
              <p className="text-[10px] text-slate-500 uppercase">{t('node_location')}:</p>
              <p>Lat: {activeNode.location.latitude.toFixed(5)}° N</p>
              <p>Lon: {activeNode.location.longitude.toFixed(5)}° E</p>
              <p className="text-[9px] text-slate-400 mt-1">Installed on Surface Survey Monument</p>
            </div>

            {/* Sensor Readouts */}
            <div className="space-y-2 mb-4">
              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>{t('tilt')} (MPU6050)</span>
                </span>
                <span className="text-sm font-bold text-white font-mono-tech">
                  {activeNode.sensors.tiltMagnitude}°
                </span>
              </div>

              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  <span>{t('vibration')} (SW-420)</span>
                </span>
                <span className="text-sm font-bold text-white font-mono-tech">
                  {activeNode.sensors.vibration} mm/s
                </span>
              </div>

              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                  <span>{t('displacement')}</span>
                </span>
                <span className="text-sm font-bold text-white font-mono-tech">
                  {activeNode.sensors.displacement} mm
                </span>
              </div>

              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center space-x-1.5">
                  <Activity className="w-3 h-3 text-red-400" />
                  <span>Continuous Crack</span>
                </span>
                <span className={`text-xs font-bold ${activeNode.sensors.crack ? 'text-red-400' : 'text-emerald-400'}`}>
                  {activeNode.sensors.crack ? 'TRIGGERED' : 'UNBROKEN'}
                </span>
              </div>
            </div>

            {/* Hardware Status */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono-tech mb-4">
              <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Battery</span>
                <span className="font-bold text-white flex items-center space-x-1">
                  <Battery className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{activeNode.battery}%</span>
                </span>
              </div>
              <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Mesh Signal</span>
                <span className="font-bold text-white flex items-center space-x-1">
                  <Wifi className="w-3.5 h-3.5 text-cyan-400" />
                  <span>-78 dBm</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => setFocusedNodeId(activeNode.id)}
              className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow"
            >
              Focus Map on {activeNode.label}
            </button>
          </div>

          {/* Quick List of Nodes in Current Filter */}
          <div className="bg-[#0f172a]/95 border border-slate-800 rounded-2xl p-3 shadow-sm text-left max-h-[300px] overflow-y-auto">
            <p className="text-xs font-bold text-slate-300 mb-2 px-1">
              Nodes in View ({filteredNodes.length})
            </p>
            <div className="space-y-1">
              {filteredNodes.map(node => (
                <div
                  key={node.id}
                  onClick={() => {
                    setSelectedNode(node);
                    setFocusedNodeId(node.id);
                  }}
                  className={`p-2 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors ${
                    activeNode.id === node.id
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <span className="font-mono-tech">{node.label} ({node.location.zone})</span>
                  <span className="font-bold">{node.riskLevel}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
