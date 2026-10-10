import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useKavachData } from '../../hooks/useKavachData';
import { Cpu } from 'lucide-react';

export const NodeDetailsTable: React.FC = () => {
  const { t } = useLanguage();
  const { nodes, openNodeDetails, setFocusedNodeId } = useKavachData();
  const navigate = useNavigate();

  // Only show the real hardware nodes
const displayNodes = nodes.filter(
  node => node.id === 'N1' || node.id === 'N2'
);

  const getStatusDot = (status: string, riskLevel: string) => {
    if (riskLevel === 'CRITICAL' || status === 'Critical') {
      return (
        <span className="flex items-center space-x-1.5 text-xs text-red-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span>{t('critical')}</span>
        </span>
      );
    }
    if (riskLevel === 'WARNING' || status === 'Warning') {
      return (
        <span className="flex items-center space-x-1.5 text-xs text-amber-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          <span>{t('warning')}</span>
        </span>
      );
    }
    return (
      <span className="flex items-center space-x-1.5 text-xs text-emerald-400 font-medium">
        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        <span>{t('normal')}</span>
      </span>
    );
  };

  return (
    <div className="bg-[#0f172a]/95 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm h-[320px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            {t('node_details')}
          </h3>
        </div>
        <button
          onClick={() => navigate('/sensor-data')}
          className="text-xs text-blue-400 hover:text-blue-300 font-medium"
        >
          {t('view_all')}
        </button>
      </div>

      {/* Table with all four sensors represented */}
      <div className="overflow-x-auto my-1 grow">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-medium">
              <th className="py-2 px-2 font-mono-tech">{t('node_id')}</th>
              <th className="py-2 px-2">{t('status')}</th>
              <th className="py-2 px-2 font-mono-tech">{t('tilt')} (°)</th>
              <th className="py-2 px-2 font-mono-tech">{t('vibration')} (mm/s)</th>
              <th className="py-2 px-2 font-mono-tech">Crack</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono-tech">
            {displayNodes.map(node => (
              <tr 
                key={node.id}
                id={`node-table-row-${node.id}`}
                onClick={() => openNodeDetails(node)}
                className="hover:bg-slate-850 cursor-pointer transition-colors group"
                title={`Click to inspect ${node.id} full sensor suite`}
              >
                <td className="py-1.5 px-2 font-bold text-slate-200 group-hover:text-cyan-400">
                  {node.label.replace('Node ', '')}
                </td>
                <td className="py-1.5 px-2">
                  {getStatusDot(node.status, node.riskLevel)}
                </td>
                <td className={`py-1.5 px-2 ${node.sensors.tiltMagnitude > 1.5 ? 'text-red-400 font-bold' : 'text-slate-300'}`}>
                  {node.sensors.tiltMagnitude.toFixed(2)}
                </td>
                <td className={`py-1.5 px-2 ${node.sensors.vibration > 2.0 ? 'text-red-400 font-bold' : 'text-slate-300'}`}>
                  {node.sensors.vibration.toFixed(2)}
                </td>
                <td className="py-1.5 px-2">
                  <span className={`px-1.5 py-0.2 rounded text-[9.5px] font-bold ${
                    node.sensors.crack ? 'bg-red-950 text-red-300 border border-red-800 animate-pulse' : 'bg-slate-900 text-slate-400'
                  }`}>
                    {node.sensors.crack ? 'CRACK' : 'OK'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>LoRa Surface Mesh</span>
       <span className="text-cyan-400 font-mono-tech">
  {displayNodes.length} Nodes Active
</span>
      </div>
    </div>
  );
};
