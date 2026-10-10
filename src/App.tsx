import { useEffect } from "react";
import { testFirebase } from "./services/firebasetest";
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './hooks/useLanguage';
import { AuthProvider } from './hooks/useAuth';
import { KavachDataProvider } from './hooks/useKavachData';
import { AppLayout } from './components/layout/AppLayout';

import { Dashboard } from './pages/Dashboard';
import { LiveMapPage } from './pages/LiveMapPage';
import { SensorDataPage } from './pages/SensorDataPage';
import { AlertsPage } from './pages/AlertsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AiPredictionsPage } from './pages/AiPredictionsPage';
import { SettingsPage } from './pages/SettingsPage';
import { Login } from './pages/Login';

export default function App() {
  useEffect(() =>{
    testFirebase();
  },[]);

  return (
    <LanguageProvider>
      <AuthProvider>
        <KavachDataProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Authentication Route */}
              <Route path="/login" element={<Login />} />

              {/* Protected App Routes inside Layout */}
              <Route element={<AppLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/live-map" element={<LiveMapPage />} />
                <Route path="/sensor-data" element={<SensorDataPage />} />
                <Route path="/alerts" element={<AlertsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/ai-predictions" element={<AiPredictionsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>

              {/* Catch-all redirect to Dashboard */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </KavachDataProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
