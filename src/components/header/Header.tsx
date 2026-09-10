import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../hooks/useAuth';
import { useKavachData } from '../../hooks/useKavachData';
import { KavachLogo } from '../common/KavachLogo';
import { 
  Wifi, 
  Globe, 
  Bell, 
  Check, 
  LogOut, 
  Flame,
  ChevronDown,
  AlertTriangle,
  AlertCircle,
  Info,
  Radio,
  X
} from 'lucide-react';

export const Header: React.FC = () => {
  const { t, language, setLanguage, languages } = useLanguage();
  const { user, logout, switchRole } = useAuth();
  const { 
    systemHealth, 
    sirenState, 
    stopSiren, 
    alerts, 
    activeAlerts,
    unreadAlertCount,
    markAlertAsRead,
    markAllAlertsAsRead,
    openNodeDetails,
    setFocusedNodeId,
    connectionNotification,
    dismissConnectionNotification
  } = useKavachData();
  
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifPanelOpen(false);
      }
    };
    if (notifPanelOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notifPanelOpen]);

  return (
    <header className="bg-[#0b1329] border-b border-slate-800 text-slate-100 z-40 sticky top-0 shadow-md">
      {/* 1. Official Institutional Tricolor Micro-Stripe */}
      <div className="h-[3px] w-full flex">
        <div className="flex-1 bg-[#FF9933]"></div>
        <div className="flex-1 bg-[#F8FAFC]"></div>
        <div className="flex-1 bg-[#138808]"></div>
      </div>

      {/* 2. Connection Restored / Sync Notification Banner */}
      {connectionNotification.message && (
        <div className="bg-emerald-900 border-b border-emerald-700 px-4 py-2 flex items-center justify-between text-emerald-100 text-xs animate-in fade-in slide-in-from-top duration-200">
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-bold uppercase tracking-wider font-mono-tech">
              CONNECTION RESTORED:
            </span>
            <span className="font-medium text-emerald-200">
              {connectionNotification.message}
            </span>
          </div>
          <button
            onClick={dismissConnectionNotification}
            className="text-emerald-300 hover:text-white px-2 py-0.5 rounded text-[11px] font-semibold transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Critical Siren Alert Bar if Siren is Active */}
      {sirenState.status === 'ACTIVE' && (
        <div className="bg-red-600 px-4 py-2 flex items-center justify-between animate-pulse text-white shadow-lg shadow-red-950">
          <div className="flex items-center space-x-3">
            <Flame className="w-5 h-5 animate-bounce" />
            <span className="font-display font-bold tracking-wider text-sm sm:text-base uppercase">
              ⚠️ {t('siren_active')}: {sirenState.reason || 'Critical Subsidence Hazard Detected'} (SIMULATION MODE)
            </span>
          </div>
          <button
            id="header-stop-siren-btn"
            onClick={stopSiren}
            className="bg-white text-red-700 hover:bg-red-100 px-3.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider transition-colors shadow"
          >
            {t('stop_siren')}
          </button>
        </div>
      )}

      <div className="px-4 py-2 flex items-center justify-between gap-4">
        {/* Left: Brand & Titles with Official KAVACH Logo */}
        <div className="flex items-center space-x-3.5">
          <div className="flex items-center space-x-3">
            <KavachLogo size={42} showWordmark={false} />
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="font-display font-black text-xl tracking-wider text-white">
                  {t('app_name')}
                </span>
                <span className="hidden xl:inline-block text-[11px] px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-700/50 text-cyan-300 font-mono-tech">
                  DGMS Monitored
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-tight truncate max-w-xs md:max-w-md lg:max-w-xl">
                {t('app_subtitle')}
              </p>
              <p className="hidden md:block text-[10px] text-slate-500 font-mono-tech">
                {t('network_tag')}
              </p>
            </div>
          </div>
        </div>

        {/* Right Status Controls */}
        <div className="flex items-center space-x-2.5 sm:space-x-3.5">
          {/* Offline / Online System Status Indicator (Requirement 10, 11) */}
          {(!systemHealth.isOnline || !systemHealth.serverAvailable) ? (
            <div 
              id="header-offline-badge"
              className="flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-600/80 text-amber-300 text-xs font-bold font-mono-tech"
              title="Server unavailable or network offline. Telemetry is saved in IndexedDB persistent storage."
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <span>OFFLINE MODE • LOCAL CACHE ACTIVE</span>
            </div>
          ) : (
            <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{systemHealth.gatewayStatus === 'ONLINE' ? t('system_online') : t('system_offline')}</span>
            </div>
          )}

          {/* ESP-NOW Hardware Gateway Indicator */}
          <div className="hidden sm:flex items-center space-x-1.5 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400" title={`Gateway: ${systemHealth.gatewayStatus} | ESP-NOW Protocol Active`}>
            <Wifi className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono-tech text-[11px]">ESP-NOW Gateway</span>
          </div>

          {/* 2. Notification Bell & Panel (Synchronized with Sidebar) */}
          <div className="relative" ref={notifRef}>
            <button
              id="notification-bell-btn"
              onClick={() => setNotifPanelOpen(!notifPanelOpen)}
              className={`p-2 rounded-xl border transition-colors relative ${
                notifPanelOpen 
                  ? 'bg-blue-600 border-blue-500 text-white' 
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
              title="Notifications & System Events"
            >
              <Bell className="w-4 h-4" />
              {unreadAlertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {unreadAlertCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Panel */}
            {notifPanelOpen && (
              <div 
                id="header-notification-panel"
                className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0f172a] border border-slate-700 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
              >
                {/* Header */}
                <div className="px-4 py-3 bg-[#131d36] border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      {t('alerts_notifications')}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-mono-tech">
                      {activeAlerts.length} active
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {unreadAlertCount > 0 && (
                      <button
                        onClick={markAllAlertsAsRead}
                        className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono-tech underline"
                      >
                        Mark all read
                      </button>
                    )}
                    <button 
                      onClick={() => setNotifPanelOpen(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Notification Items List (Active Only - Resolved Disappears!) */}
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/80">
                  {activeAlerts.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      <Check className="w-6 h-6 mx-auto mb-1.5 text-emerald-400" />
                      <p className="font-semibold text-slate-200">All Strata Stable</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Sensors normal, no unresolved active alerts.</p>
                    </div>
                  ) : (
                    activeAlerts.slice(0, 8).map(alert => (
                      <div
                        key={alert.id}
                        onClick={() => {
                          markAlertAsRead(alert.id);
                          if (alert.nodeId) openNodeDetails(alert.nodeId);
                          setNotifPanelOpen(false);
                        }}
                        className={`p-3 hover:bg-slate-850 cursor-pointer transition-colors text-left flex items-start space-x-3 ${
                          alert.severity === 'CRITICAL' 
                            ? 'bg-red-950/20 hover:bg-red-950/30' 
                            : alert.severity === 'HIGH' 
                              ? 'bg-orange-950/15 hover:bg-orange-950/25' 
                              : alert.severity === 'WARNING'
                                ? 'bg-amber-950/10 hover:bg-amber-950/20'
                                : 'hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0 relative">
                          {alert.severity === 'CRITICAL' ? (
                            <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
                          ) : alert.severity === 'HIGH' ? (
                            <AlertCircle className="w-4 h-4 text-orange-400" />
                          ) : alert.severity === 'WARNING' ? (
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                          ) : (
                            <Radio className="w-4 h-4 text-cyan-400" />
                          )}
                          {alert.readState === 'UNREAD' && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-[#0f172a]" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold truncate ${
                              alert.severity === 'CRITICAL' ? 'text-red-400' : alert.severity === 'HIGH' ? 'text-orange-300' : 'text-slate-200'
                            }`}>
                              {alert.title}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono-tech shrink-0 ml-2">
                              {alert.timestamp}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 mt-0.5 leading-snug line-clamp-2">
                            {alert.reason}
                          </p>
                          <div className="flex items-center space-x-2 mt-1.5 text-[10px] text-slate-400 font-mono-tech">
                            <span className="px-1.5 py-0.2 rounded bg-slate-800 border border-slate-700">
                              {alert.nodeId}
                            </span>
                            <span>{alert.zone}</span>
                            {alert.riskScore !== undefined && (
                              <span className="font-bold text-amber-400">Score: {alert.riskScore}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="p-2.5 bg-[#0b1020] border-t border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 font-mono-tech">
                    Live Subsidence Event Feed • ESP-NOW Connected
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              id="language-dropdown-btn"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 border border-slate-700 text-xs font-medium text-slate-200 transition-colors shadow-sm"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{languages.find(l => l.code === language)?.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {langDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 rounded-xl bg-[#0f172a] border border-slate-700 shadow-xl py-1 z-50 divide-y divide-slate-800"
                onMouseLeave={() => setLangDropdownOpen(false)}
              >
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    id={`lang-select-${lang.code}`}
                    onClick={() => {
                      setLanguage(lang.code);
                      setLangDropdownOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-800 text-slate-200 transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{lang.nativeName}</span>
                      <span className="text-[10px] text-slate-400">{lang.name}</span>
                    </div>
                    {language === lang.code && (
                      <Check className="w-4 h-4 text-cyan-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile / Role */}
          <div className="relative">
            <button
              id="user-profile-btn"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center space-x-2.5 pl-2 pr-1 py-1 rounded-xl hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-700"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow">
                {user ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'AS'}
              </div>
              <div className="hidden md:flex flex-col text-left text-xs">
                <span className="font-semibold text-slate-200 leading-tight">
                  {user?.role || t('operator')}
                </span>
                <span className="text-[10px] text-slate-400 leading-tight truncate max-w-[90px]">
                  {t('mine_site')}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 hidden md:block" />
            </button>

            {userDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0f172a] border border-slate-700 shadow-xl py-2 z-50"
                onMouseLeave={() => setUserDropdownOpen(false)}
              >
                <div className="px-3.5 py-2 border-b border-slate-800">
                  <p className="text-xs font-bold text-white">{user?.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                  <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300 font-mono-tech">
                    {user?.role}
                  </span>
                </div>

                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Simulation Role
                </div>
                <button
                  id="role-switch-operator"
                  onClick={() => { switchRole('Mine Operator'); setUserDropdownOpen(false); }}
                  className="w-full text-left px-3.5 py-1.5 text-xs text-slate-200 hover:bg-slate-800 flex items-center justify-between"
                >
                  <span>Mine Operator</span>
                  {user?.role === 'Mine Operator' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
                <button
                  id="role-switch-officer"
                  onClick={() => { switchRole('Mine Safety Officer'); setUserDropdownOpen(false); }}
                  className="w-full text-left px-3.5 py-1.5 text-xs text-slate-200 hover:bg-slate-800 flex items-center justify-between"
                >
                  <span>Mine Safety Officer</span>
                  {user?.role === 'Mine Safety Officer' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
                <button
                  id="role-switch-admin"
                  onClick={() => { switchRole('Admin'); setUserDropdownOpen(false); }}
                  className="w-full text-left px-3.5 py-1.5 text-xs text-slate-200 hover:bg-slate-800 flex items-center justify-between"
                >
                  <span>Admin</span>
                  {user?.role === 'Admin' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </button>

                <div className="border-t border-slate-800 mt-2 pt-1">
                  <button
                    id="logout-btn"
                    onClick={() => { logout(); setUserDropdownOpen(false); }}
                    className="w-full text-left px-3.5 py-1.5 text-xs text-red-400 hover:bg-red-950/40 flex items-center space-x-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t('logout')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
