import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useKavachData } from '../../hooks/useKavachData';
import { TrendPoint } from '../../types';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar 
} from 'recharts';

const LINE_COLORS = ['#38bdf8', '#f59e0b', '#c084fc', '#10b981', '#ec4899', '#facc15'];

export const DeformationTrends: React.FC = () => {
  const { t } = useLanguage();
  const { trends, nodes } = useKavachData();
  const [activeTab, setActiveTab] = useState<'tilt' | 'displacement' | 'vibration' | 'crack'>('tilt');

  const getLineChartData = (): TrendPoint[] => {
    switch (activeTab) {
      case 'displacement':
        return trends.displacement;
      case 'vibration':
        return trends.vibration;
      default:
        return trends.tilt;
    }
  };

  const getYDomain = (): [number, number] => {
    switch (activeTab) {
      case 'displacement':
        return [0, 4.0];
      case 'vibration':
        return [0, 3.0];
      case 'crack':
        return [0, 5];
      default:
        return [0, 2.5];
    }
  };

  // Dynamic list of currently connected nodes (instead of hardcoded Node12/16/27/34)
  const activeNodeIds = nodes.map(n => n.id);

  return (
    <div className="bg-[#0f172a]/95 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm h-[320px]">
      {/* Top Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <h3 className="text-sm font-bold text-white tracking-wide text-left">
          {t('deformation_trends')}
        </h3>

        <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          {(['tilt', 'displacement', 'vibration', 'crack'] as const).map(tab => (
            <button
              key={tab}
              id={`tab-trend-${tab}`}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {t(tab)}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="w-full h-[180px] my-1">
        {activeTab === 'crack' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trends.crack}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} 
              />
              <Bar dataKey="opened" fill="#ef4444" radius={[4, 4, 0, 0]} name="Triggered Crack Sensors" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getLineChartData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="#64748b" 
                fontSize={10} 
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={10} 
                domain={getYDomain()} 
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
              />
              {activeNodeIds.map((nodeId, idx) => (
                <Line
                  key={nodeId}
                  type="monotone"
                  dataKey={nodeId}
                  stroke={LINE_COLORS[idx % LINE_COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 3, fill: LINE_COLORS[idx % LINE_COLORS.length] }}
                  name={nodeId}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend Row - dynamic */}
      <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-300 font-medium pt-1 border-t border-slate-800/80">
        {activeNodeIds.map((nodeId, idx) => (
          <div key={nodeId} className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: LINE_COLORS[idx % LINE_COLORS.length] }}></span>
            <span>{nodeId}</span>
          </div>
        ))}
      </div>
    </div>
  );
};