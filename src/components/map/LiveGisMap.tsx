import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useLanguage } from '../../hooks/useLanguage';
import { useKavachData } from '../../hooks/useKavachData';
import { MINE_BOUNDARY } from '../../data/mockNodes';
import { SensorNode } from '../../types';
import { 
  Layers, 
  Compass, 
  AlertTriangle, 
  X, 
  Radio, 
  Activity, 
  Maximize2,
  ChevronDown,
  Navigation
} from 'lucide-react';

interface LiveGisMapProps {
  onSelectNode?: (node: SensorNode) => void;
  fullHeight?: boolean;
}

export const LiveGisMap: React.FC<LiveGisMapProps> = ({ onSelectNode, fullHeight = false }) => {
  const { t } = useLanguage();
  const { nodes, focusedNodeId, setFocusedNodeId, openNodeDetails, criticalPopupAlert, dismissCriticalPopup, stopSiren } = useKavachData();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const [activeMapMode, setActiveMapMode] = useState<'surface' | 'underground'>('surface');
  const [tileType, setTileType] = useState<'satellite' | 'dark' | 'topo'>('satellite');
  const [selectedNodeModal, setSelectedNodeModal] = useState<SensorNode | null>(null);
  const [viewDropdownOpen, setViewDropdownOpen] = useState(false);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center coordinates for Jharia Coalfield pit area
    const centerLat = 23.7965;
    const centerLng = 86.4300;

    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
    });

    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    mapInstanceRef.current = map;
    layerGroupRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when tileType changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing tile layers
    map.eachLayer(layer => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    let tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    let attribution = 'Esri World Imagery';

    if (tileType === 'dark') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      attribution = 'CartoDB Dark';
    } else if (tileType === 'topo') {
      tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      attribution = 'OpenTopoMap';
    }

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      attribution,
    }).addTo(map);
  }, [tileType]);

  // Render Mine Boundary, Mesh links, Risk Zones, and Nodes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const lg = layerGroupRef.current;
    if (!map || !lg) return;

    lg.clearLayers();

    // 1. Mine Boundary Polygon (tactical high-contrast outline)
    const boundaryPolygon = L.polygon(MINE_BOUNDARY, {
      color: activeMapMode === 'surface' ? '#06b6d4' : '#f59e0b',
      weight: 2,
      opacity: 0.85,
      dashArray: '5, 8',
      fillColor: activeMapMode === 'surface' ? '#0891b2' : '#d97706',
      fillOpacity: 0.08,
    });
    lg.addLayer(boundaryPolygon);

    // 2. Risk Heat Zones (Concentric gradient circles matching reference image)
    nodes.forEach(node => {
      const lat = node.location.latitude;
      const lng = node.location.longitude;

      if (node.riskLevel === 'CRITICAL' || node.isHighRisk) {
        // Red Hot Center
        const redCore = L.circle([lat, lng], {
          radius: 180,
          fillColor: '#ef4444',
          fillOpacity: 0.55,
          color: '#dc2626',
          weight: 2,
        });
        // Orange Outer Gradient
        const orangeMid = L.circle([lat, lng], {
          radius: 350,
          fillColor: '#f97316',
          fillOpacity: 0.35,
          color: '#ea580c',
          weight: 1,
        });
        // Yellow Outer Transition
        const yellowOuter = L.circle([lat, lng], {
          radius: 520,
          fillColor: '#eab308',
          fillOpacity: 0.2,
          color: '#ca8a04',
          weight: 1,
          dashArray: '4, 6',
        });

        lg.addLayer(yellowOuter);
        lg.addLayer(orangeMid);
        lg.addLayer(redCore);
      } else if (node.riskLevel === 'WARNING') {
        const warningRing = L.circle([lat, lng], {
          radius: 200,
          fillColor: '#eab308',
          fillOpacity: 0.3,
          color: '#facc15',
          weight: 1.5,
        });
        lg.addLayer(warningRing);
      }
    });

    // 4. Node Markers
    nodes.forEach(node => {
      const lat = node.location.latitude;
      const lng = node.location.longitude;
      const isCritical = node.riskLevel === 'CRITICAL' || node.isHighRisk;
      const isWarning = node.riskLevel === 'WARNING';
      const isOffline = node.status === 'Offline';

      let markerColor = '#10b981'; // normal green
      if (isOffline) markerColor = '#64748b';
      else if (isCritical) markerColor = '#ef4444';
      else if (isWarning) markerColor = '#f59e0b';

      const customHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          ${
            isCritical
              ? `<div class="absolute -inset-3 rounded-full bg-red-500/40 animate-ping-slow"></div>
                 <div class="absolute -inset-1.5 rounded-full bg-red-600/60 animate-pulse"></div>`
              : ''
          }
          <div class="w-5 h-5 rounded-full border-2 border-slate-900 flex items-center justify-center shadow-lg transition-transform group-hover:scale-125" style="background-color: ${markerColor}">
            <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
          </div>
          <div class="absolute -bottom-5 whitespace-nowrap bg-slate-950/90 text-slate-200 text-[10px] font-mono-tech px-1 py-0.2 rounded border border-slate-800 shadow">
            ${node.label}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: customHtml,
        className: 'custom-node-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      marker.on('click', () => {
        setFocusedNodeId(node.id);
        openNodeDetails(node);
        if (onSelectNode) onSelectNode(node);
      });

      marker.bindTooltip(
        `<strong>${node.label} (${node.location.zone})</strong><br/>
         Status: ${node.status}<br/>
         Tilt: ${node.sensors.tiltMagnitude}° | Vib: ${node.sensors.vibration} mm/s<br/>
         Disp: ${node.sensors.displacement} mm | Risk: ${node.riskScore}/100`,
        { direction: 'top', offset: [0, -10] }
      );

      lg.addLayer(marker);
    });
  }, [nodes, activeMapMode]);

  // Automatically focus/zoom the map toward the affected/focused node
  useEffect(() => {
    if (!focusedNodeId || !mapInstanceRef.current) return;
    const target = nodes.find(n => n.id === focusedNodeId);
    if (target) {
      mapInstanceRef.current.flyTo(
        [target.location.latitude, target.location.longitude],
        16,
        { duration: 1.2 }
      );
    }
  }, [focusedNodeId, nodes]);

  const focusedNode = nodes.find(n => n.id === focusedNodeId) || nodes[0];

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-slate-800 shadow-md ${fullHeight ? 'h-[750px]' : 'h-[460px]'}`}>
      {/* Leaflet DOM Anchor */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top-Left Controls: Surface Map vs Underground Seam */}
      <div className="absolute top-3.5 left-3.5 z-20 flex items-center space-x-2 bg-slate-900/85 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-lg">
        <button
          id="map-mode-surface-btn"
          onClick={() => setActiveMapMode('surface')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeMapMode === 'surface'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>{t('surface_map')}</span>
        </button>

        <button
          id="map-mode-underground-btn"
          onClick={() => setActiveMapMode('underground')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeMapMode === 'underground'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{t('underground_seam')}</span>
        </button>
      </div>

      {/* Top-Right Controls: Map View Dropdown */}
      <div className="absolute top-3.5 right-3.5 z-20">
        <div className="relative">
          <button
            id="map-view-dropdown-btn"
            onClick={() => setViewDropdownOpen(!viewDropdownOpen)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/80 text-xs font-semibold text-slate-200 shadow-lg hover:bg-slate-800 transition-colors"
          >
            <span>{t('map_view')}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {viewDropdownOpen && (
            <div 
              className="absolute right-0 mt-1.5 w-44 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-1 z-30"
              onMouseLeave={() => setViewDropdownOpen(false)}
            >
              <button
                onClick={() => { setTileType('satellite'); setViewDropdownOpen(false); }}
                className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-slate-800 ${tileType === 'satellite' ? 'text-cyan-400 font-bold' : 'text-slate-200'}`}
              >
                <span>Satellite Imagery</span>
                {tileType === 'satellite' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>}
              </button>
              <button
                onClick={() => { setTileType('dark'); setViewDropdownOpen(false); }}
                className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-slate-800 ${tileType === 'dark' ? 'text-cyan-400 font-bold' : 'text-slate-200'}`}
              >
                <span>Tactical Dark Mode</span>
                {tileType === 'dark' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>}
              </button>
              <button
                onClick={() => { setTileType('topo'); setViewDropdownOpen(false); }}
                className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-slate-800 ${tileType === 'topo' ? 'text-cyan-400 font-bold' : 'text-slate-200'}`}
              >
                <span>Topographical Contours</span>
                {tileType === 'topo' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tactical Compass Rose (matching reference image) */}
      <div className="absolute top-16 left-4 z-10 w-9 h-9 rounded-full bg-slate-950/80 border border-slate-700/80 flex flex-col items-center justify-center text-slate-300 shadow-lg pointer-events-none">
        <span className="text-[9px] font-bold leading-none text-red-400">N</span>
        <Compass className="w-4 h-4 text-cyan-400" />
      </div>

      {/* OVERLAID CRITICAL ALERT POPUP CARD (Requirement 12) */}
      {criticalPopupAlert && (
        <div 
          id="map-critical-alert-overlay"
          className="absolute top-10 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:right-10 z-40 w-[310px] sm:w-[360px] bg-[#160c11]/95 border-2 border-red-500 rounded-2xl p-4 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-red-900/60 pb-2 mb-3">
            <div className="flex items-center space-x-2 text-red-500">
              <div className="w-7 h-7 rounded-lg bg-red-950/90 border border-red-700/60 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
              </div>
              <span className="text-sm font-black tracking-wider uppercase font-display text-red-400">
                🚨 CRITICAL ALERT
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-red-950 border border-red-800 text-[10px] font-mono-tech text-red-300 animate-pulse">
              SIREN ACTIVE
            </span>
          </div>

          {/* Subtitle / Title */}
          <h4 className="text-sm font-bold text-white mb-2">
            High Risk Zone Detected
          </h4>

          {/* Key Facts */}
          <div className="bg-red-950/40 border border-red-900/50 rounded-xl p-3 space-y-1.5 text-xs text-slate-200 font-mono-tech">
            <div className="flex justify-between">
              <span className="text-slate-400">Node:</span>
              <span className="font-bold text-white">{criticalPopupAlert.nodeId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Zone:</span>
              <span className="font-bold text-red-400">{criticalPopupAlert.zone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Risk Score:</span>
              <span className="font-bold text-red-400">{criticalPopupAlert.riskScore}/100</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-red-900/40 text-[11px]">
              <span className="text-slate-400">Reason:</span>
              <span className="text-right text-red-200 truncate max-w-[200px]">{criticalPopupAlert.reason}</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Time:</span>
              <span>{criticalPopupAlert.timestamp}</span>
            </div>
          </div>

          <div className="mt-2.5 p-1.5 bg-red-950/30 rounded-lg text-center text-[10px] text-red-300 font-mono-tech">
            SIREN ACTIVE • SIMULATION MODE
          </div>

          {/* STOP SIREN Action - NO Mute */}
          <div className="mt-3 flex items-center space-x-2">
            <button
              id="critical-alert-stop-siren-btn"
              onClick={stopSiren}
              className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-red-950 transition-all text-center"
            >
              STOP SIREN
            </button>
            <button
              id="view-critical-alert-details-btn"
              onClick={() => {
                const node = nodes.find(n => n.id === criticalPopupAlert.nodeId) || nodes[0];
                openNodeDetails(node);
              }}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              Details
            </button>
          </div>
        </div>
      )}

      {/* Map Scale Bar (matching reference design bottom-left: 0 250 500 1,000 m) */}
      <div className="absolute bottom-3 left-14 z-20 bg-slate-950/80 backdrop-blur-sm px-2.5 py-1 rounded border border-slate-800 text-[10px] text-slate-400 font-mono-tech flex flex-col items-start pointer-events-none">
        <div className="flex justify-between w-28 text-[9px] text-slate-400">
          <span>0</span>
          <span>250</span>
          <span>500</span>
          <span>1,000 m</span>
        </div>
        <div className="w-28 h-1 bg-slate-700 flex">
          <div className="w-1/4 h-full bg-white"></div>
          <div className="w-1/4 h-full bg-slate-900"></div>
          <div className="w-1/4 h-full bg-white"></div>
          <div className="w-1/4 h-full bg-slate-900"></div>
        </div>
      </div>

      {/* Map Risk Legend (matching reference design bottom-right) */}
      <div className="absolute bottom-3 right-3 z-20 bg-slate-950/85 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 text-xs text-slate-200 shadow-lg space-y-1">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <span className="text-[11px]">{t('normal')}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
          <span className="text-[11px]">{t('warning')}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
          <span className="text-[11px]">{t('critical')}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-[11px] font-semibold text-red-400">{t('high_risk')}</span>
        </div>
      </div>

      {/* Node Details Inspection Modal / Popup */}
      {selectedNodeModal && (
        <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-5 text-left text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  selectedNodeModal.riskLevel === 'CRITICAL' ? 'bg-red-950 text-red-400' :
                  selectedNodeModal.riskLevel === 'WARNING' ? 'bg-amber-950 text-amber-400' : 'bg-emerald-950 text-emerald-400'
                }`}>
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    {selectedNodeModal.label} ({selectedNodeModal.location.zone})
                  </h3>
                  <p className="text-xs text-slate-400 font-mono-tech">
                    {t('node_location')}: Lat {selectedNodeModal.location.latitude.toFixed(4)}, Lon {selectedNodeModal.location.longitude.toFixed(4)}
                  </p>
                </div>
              </div>
              <button
                id="close-node-inspection-btn"
                onClick={() => setSelectedNodeModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5">
                <span className="text-[10px] text-slate-400 uppercase">{t('tilt')}</span>
                <p className="text-lg font-bold text-white font-mono-tech">{selectedNodeModal.sensors.tiltMagnitude}°</p>
                <span className={`text-[10px] ${selectedNodeModal.rateOfChange.tiltTrend === 'increasing' ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {selectedNodeModal.rateOfChange.tiltTrend === 'increasing' ? '↑ Rising' : '→ Stable'}
                </span>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5">
                <span className="text-[10px] text-slate-400 uppercase">{t('vibration')}</span>
                <p className="text-lg font-bold text-white font-mono-tech">{selectedNodeModal.sensors.vibration} <span className="text-[10px]">mm/s</span></p>
                <span className="text-[10px] text-slate-400 font-mono-tech">Peak Particle</span>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5">
                <span className="text-[10px] text-slate-400 uppercase">{t('displacement')}</span>
                <p className="text-lg font-bold text-white font-mono-tech">{selectedNodeModal.sensors.displacement} <span className="text-[10px]">mm</span></p>
                <span className="text-[10px] text-slate-400 font-mono-tech">Total Shift</span>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5">
                <span className="text-[10px] text-slate-400 uppercase">{t('risk_score')}</span>
                <p className={`text-lg font-bold font-mono-tech ${selectedNodeModal.riskScore > 75 ? 'text-red-400' : selectedNodeModal.riskScore > 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {selectedNodeModal.riskScore}/100
                </p>
                <span className="text-[10px] font-semibold uppercase">{selectedNodeModal.riskLevel}</span>
              </div>
            </div>

            {/* Optical Crack Sensor Status */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Activity className={`w-4 h-4 ${selectedNodeModal.sensors.crack ? 'text-red-500 animate-bounce' : 'text-slate-400'}`} />
                <span className="text-xs font-semibold text-slate-200">Continuous Surface Crack Transducer:</span>
              </div>
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase ${
                selectedNodeModal.sensors.crack ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}>
                {selectedNodeModal.sensors.crack ? 'CRACK TRIGGERED' : 'UNBROKEN / NORMAL'}
              </span>
            </div>

            {/* Hardware Telemetry Specs */}
            <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 font-mono-tech mb-4">
              <div><span className="text-slate-500">Battery:</span> {selectedNodeModal.battery}%</div>
              <div><span className="text-slate-500">Connectivity:</span> {selectedNodeModal.connectivity}</div>
              <div><span className="text-slate-500">Telemetry:</span> 15-min LoRa</div>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                id="close-node-dialog-btn"
                onClick={() => setSelectedNodeModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
