import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Header } from '../header/Header';
import { Sidebar } from '../sidebar/Sidebar';
import { useAuth } from '../../hooks/useAuth';
import { CriticalAlertModal } from '../alerts/CriticalAlertModal';
import { NodeInspectionModal } from '../nodes/NodeInspectionModal';

export const AppLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center text-slate-400 font-mono-tech text-xs">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>Initializing KAVACH Control Room Core...</span>
        </div>
      </div>
    );
  }

  // Protect all dashboard routes
  if (!isAuthenticated && location.pathname !== '/login') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans overflow-x-hidden">
      {/* 1. Top Header */}
      <Header />

      {/* 2. Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Scrollable Center Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-5 bg-gradient-to-b from-[#070b14] via-[#090e1b] to-[#070b14]">
          <div className="max-w-[1700px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Modals */}
      <CriticalAlertModal />
      <NodeInspectionModal />
    </div>
  );
};
