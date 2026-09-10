import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useKavachData } from '../../hooks/useKavachData';
import { 
  LayoutDashboard, 
  Map, 
  Radio, 
  Bell, 
  BarChart3, 
  BrainCircuit, 
  Settings, 
  Leaf, 
  Cloud,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { t } = useLanguage();
  const { alerts, unreadAlertCount, systemHealth } = useKavachData();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('kavach_sidebar_collapsed') === 'true';
  });

  const toggleSidebar = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('kavach_sidebar_collapsed', String(next));
      return next;
    });
  };

  const navItems = [
    { to: '/', label: t('dashboard'), icon: LayoutDashboard, exact: true },
    { to: '/live-map', label: t('live_map'), icon: Map },
    { to: '/sensor-data', label: t('sensor_data'), icon: Radio },
    { 
      to: '/alerts', 
      label: t('alerts_notifications'), 
      icon: Bell, 
      badge: unreadAlertCount > 0 ? unreadAlertCount : undefined,
      badgeColor: 'bg-red-500'
    },
    { to: '/analytics', label: t('analytics_reports'), icon: BarChart3 },
    { to: '/ai-predictions', label: t('ai_predictions'), icon: BrainCircuit },
    { to: '/settings', label: t('settings'), icon: Settings },
  ];

  return (
    <aside 
      className={`bg-[#0a0f1d] border-r border-slate-800/80 flex flex-col justify-between shrink-0 select-none transition-all duration-300 relative ${
        isCollapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      {/* Top Collapse Toggle Button */}
      <div className={`pt-3 pb-2 px-3 flex items-center ${isCollapsed ? 'justify-center' : 'justify-end'} border-b border-slate-800/50`}>
        <button
          id="sidebar-toggle-btn"
          onClick={toggleSidebar}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700/80 transition-colors shadow-sm"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-cyan-400" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-cyan-400" />
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <div className="py-3 px-2.5 space-y-1.5 flex-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            id={`nav-link-${item.to.replace('/', '') || 'dashboard'}`}
            title={isCollapsed ? item.label : undefined}
            className={({ isActive }) =>
              `flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-between px-3.5'} py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} relative`}>
                  <item.icon className={`w-4 h-4 transition-colors shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                  {isCollapsed && item.badge && (
                    <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                {!isCollapsed && (
                  item.badge ? (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold text-white ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  ) : (
                    isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-200" />
                  )
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Bottom Information Cards (matching reference image) */}
      <div className={`p-3 space-y-2.5 border-t border-slate-800/60 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
        {!isCollapsed ? (
          <>
            {/* Energy Efficient card */}
            <div className="bg-[#0f172a]/90 border border-slate-800 rounded-xl p-3 flex items-center space-x-3 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800/60 flex items-center justify-center shrink-0">
                <Leaf className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-emerald-400 leading-tight">{t('energy_efficient')}</p>
                <p className="text-[11px] text-slate-400 leading-tight">{t('low_power_nodes')}</p>
              </div>
            </div>

            {/* Made in India badge */}
            <div className="bg-[#0f172a]/90 border border-slate-800 rounded-xl p-2.5 flex items-center space-x-2.5 shadow-sm">
              {/* Stylized Tricolor circle */}
              <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-700 flex flex-col shrink-0">
                <div className="h-2 bg-[#FF9933]"></div>
                <div className="h-2 bg-white flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-[#000080]"></div>
                </div>
                <div className="h-2 bg-[#138808]"></div>
              </div>
              <span className="text-xs font-medium text-slate-300">
                {t('made_in_india')}
              </span>
            </div>

            {/* Bottom Sync status */}
            <div className="pt-2 px-1 flex items-center justify-between text-[11px] text-slate-400 font-mono-tech border-t border-slate-800/50">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>{t('last_sync')}: {systemHealth.lastSync}</span>
              </div>
              <div className="flex items-center space-x-1 text-slate-500">
                <Cloud className="w-3 h-3 text-cyan-400" />
                <span>{systemHealth.cloudStatus === 'CONNECTED' ? t('cloud_connected') : t('cloud_cached')}</span>
              </div>
            </div>
          </>
        ) : (
          /* Collapsed Mini Badges */
          <div className="flex flex-col items-center space-y-3 py-1">
            <div 
              title={`${t('energy_efficient')}: ${t('low_power_nodes')}`}
              className="w-9 h-9 rounded-xl bg-emerald-950/90 border border-emerald-800/60 flex items-center justify-center cursor-help"
            >
              <Leaf className="w-4 h-4 text-emerald-400" />
            </div>

            <div 
              title={t('made_in_india')}
              className="w-7 h-7 rounded-full overflow-hidden border border-slate-700 flex flex-col shrink-0 cursor-help"
            >
              <div className="h-2.5 bg-[#FF9933]"></div>
              <div className="h-2 bg-white flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-[#000080]"></div>
              </div>
              <div className="h-2.5 bg-[#138808]"></div>
            </div>

            <div 
              title={`${t('last_sync')}: ${systemHealth.lastSync}`}
              className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"
            />
          </div>
        )}
      </div>
    </aside>
  );
};
