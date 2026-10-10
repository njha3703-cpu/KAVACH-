import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useKavachData } from '../hooks/useKavachData';
import { PrintableReport } from '../components/reports/PrintableReport';
import { 
  BarChart3, 
  Printer 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

const LINE_COLORS = ['#38bdf8', '#f59e0b', '#c084fc', '#10b981', '#ec4899', '#facc15'];

export const AnalyticsPage: React.FC = () => {
  const { t } = useLanguage();
  const { nodes, trends, kpis, alerts, systemHealth, aiPrediction } = useKavachData();
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const activeNodeIds = nodes.map(n => n.id);

  // Zone stability aggregations - built dynamically from live connected nodes
  const zoneMap = new Map<string, { tiltSum: number; dispSum: number; riskSum: number; count: number }>();
  nodes.forEach(n => {
    const key = n.location.zone;
    const entry = zoneMap.get(key) || { tiltSum: 0, dispSum: 0, riskSum: 0, count: 0 };
    entry.tiltSum += n.sensors.tiltMagnitude;
    entry.dispSum += n.sensors.displacement;
    entry.riskSum += n.riskScore;
    entry.count += 1;
    zoneMap.set(key, entry);
  });

  const zoneStats = Array.from(zoneMap.entries()).map(([zone, v]) => {
    const avgTilt = Number((v.tiltSum / v.count).toFixed(2));
    const avgDisp = Number((v.dispSum / v.count).toFixed(1));
    const riskScore = Math.round(v.riskSum / v.count);
    const status = riskScore > 75 ? 'High Risk' : riskScore > 40 ? 'Caution' : riskScore > 20 ? 'Normal' : 'Stable';
    return { zone, avgTilt, avgDisp, riskScore, status };
  });

  const handlePrint = () => {
    setIsPrintModalOpen(true);
  };

  return (
    <div className="space-y-4 pb-20 text-left">
      {/* Top Header */}
      <div className="bg-[#0f172a]/95 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800/60 flex items-center justify-center text-indigo-400 shrink-0 shadow">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-display">
              {t('analytics_reports')} & Geotechnical Subsurface Trends
            </h2>
            <p className="text-xs text-slate-400">
              DGMS Technical Compliance • Continuous Strata Displacement Analytics
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            {(['24h', '7d', '30d'] as const).map(r => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  timeRange === r
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Main Trends Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Tilt Progression Over Time */}
        <div className="bg-[#0f172a]/95 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <h3 className="text-sm font-bold text-white mb-2 flex items-center justify-between">
            <span>Ground Tilt Magnitude (Degrees °)</span>
            <span className="text-xs text-slate-400 font-mono-tech">Threshold: 1.0° (DGMS)</span>
          </h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends.tilt} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                {activeNodeIds.map((nodeId, idx) => (
                  <Line
                    key={nodeId}
                    type="monotone"
                    dataKey={nodeId}
                    stroke={LINE_COLORS[idx % LINE_COLORS.length]}
                    strokeWidth={2}
                    name={nodeId}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Displacement Progression */}
        <div className="bg-[#0f172a]/95 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <h3 className="text-sm font-bold text-white mb-2 flex items-center justify-between">
            <span>Surface Displacement Trend (mm)</span>
            <span className="text-xs text-slate-400 font-mono-tech">Threshold: 2.0 mm</span>
          </h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends.displacement} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                {activeNodeIds.map((nodeId, idx) => (
                  <Line
                    key={nodeId}
                    type="monotone"
                    dataKey={nodeId}
                    stroke={LINE_COLORS[idx % LINE_COLORS.length]}
                    strokeWidth={2}
                    name={nodeId}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Zone Stability Comparison Table */}
      <div className="bg-[#0f172a]/95 border border-slate-800 rounded-2xl p-4 shadow-sm">
        <h3 className="text-sm font-bold text-white mb-3">
          Geotechnical Stratum Stability by Mine Sector
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono-tech">
                <th className="py-2.5 px-3">Mine Zone</th>
                <th className="py-2.5 px-3">Avg. Ground Tilt (°)</th>
                <th className="py-2.5 px-3">Avg. Displacement (mm)</th>
                <th className="py-2.5 px-3">Risk Assessment Index</th>
                <th className="py-2.5 px-3">Status Condition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono-tech">
              {zoneStats.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 px-3 text-slate-500 text-center font-sans">
                    No connected node data yet
                  </td>
                </tr>
              ) : (
                zoneStats.map((z, idx) => (
                  <tr key={idx} className="hover:bg-slate-850 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-white font-sans">{z.zone}</td>
                    <td className="py-2.5 px-3 text-slate-200">{z.avgTilt}°</td>
                    <td className="py-2.5 px-3 text-slate-200">{z.avgDisp} mm</td>
                    <td className="py-2.5 px-3 font-bold">
                      <span className={z.riskScore > 75 ? 'text-red-400' : z.riskScore > 40 ? 'text-amber-400' : 'text-emerald-400'}>
                        {z.riskScore} / 100
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-sans">
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                        z.status === 'High Risk' ? 'bg-red-950 text-red-400 border border-red-800' :
                        z.status === 'Caution' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                        'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}>
                        {z.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hidden element dedicated for @media print */}
      <PrintableReport
        nodes={nodes}
        alerts={alerts}
        systemHealth={systemHealth}
        aiPrediction={aiPrediction}
        kpis={kpis}
      />

      {/* Interactive Print Preview & Save PDF Modal */}
      {isPrintModalOpen && (
        <PrintableReport
          nodes={nodes}
          alerts={alerts}
          systemHealth={systemHealth}
          aiPrediction={aiPrediction}
          kpis={kpis}
          isModal={true}
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}
    </div>
  );
};