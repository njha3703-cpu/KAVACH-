import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { kavachDataService } from '../services/dataService';
import { SensorNode, Alert, SirenState, SystemHealth, AiPredictionData } from '../types';
import { SensorThresholds } from '../ai/riskEngine';

interface KavachDataContextType {
  nodes: SensorNode[];
  alerts: Alert[];
  activeAlerts: Alert[];
  alertHistory: Alert[];
  unreadAlertCount: number;
  sirenState: SirenState;
  systemHealth: SystemHealth;
  thresholds: SensorThresholds;
  focusedNodeId: string | null;
  inspectingNode: SensorNode | null;
  criticalPopupAlert: Alert | null;
  connectionNotification: { type: 'RESTORED' | 'SYNCED' | null; message: string | null };
  trends: ReturnType<typeof kavachDataService.getTrends>;
  kpis: ReturnType<typeof kavachDataService.getKpis>;
  aiPrediction: AiPredictionData;
  isSimulating: boolean;
  setFocusedNodeId: (id: string | null) => void;
  setInspectingNode: (node: SensorNode | null) => void;
  openNodeDetails: (target: string | SensorNode) => void;
  dismissCriticalPopup: () => void;
  dismissConnectionNotification: () => void;
  markAlertAsRead: (id: string) => void;
  markAllAlertsAsRead: () => void;
  setThresholds: (t: Partial<SensorThresholds>) => void;
  triggerSiren: (reason?: string) => void;
  stopSiren: () => void;
  acknowledgeAlert: (id: string) => void;
  resolveAlert: (id: string) => void;
  triggerEmergencyEvacuation: () => void;
  simulateWarning: () => void;
  simulateHighRisk: () => void;
  simulateCriticalAlert: () => void;
  addNode: (node: SensorNode) => void;
  removeNode: (nodeId: string) => void;
  ingestEsp32Telemetry: typeof kavachDataService.ingestEsp32Telemetry;
}

const KavachDataContext = createContext<KavachDataContextType | undefined>(undefined);

export const KavachDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = kavachDataService.subscribe(() => {
      setTick(t => t + 1);
    });
    return unsubscribe;
  }, []);

  const value: KavachDataContextType = {
    nodes: kavachDataService.getNodes(),
    alerts: kavachDataService.getAlerts(),
    activeAlerts: kavachDataService.getActiveAlerts(),
    alertHistory: kavachDataService.getAlertHistory(),
    unreadAlertCount: kavachDataService.getUnreadAlertCount(),
    sirenState: kavachDataService.getSirenState(),
    systemHealth: kavachDataService.getSystemHealth(),
    thresholds: kavachDataService.getThresholds(),
    focusedNodeId: kavachDataService.getFocusedNodeId(),
    inspectingNode: kavachDataService.getInspectingNode(),
    criticalPopupAlert: kavachDataService.getCriticalPopupAlert(),
    connectionNotification: kavachDataService.getConnectionNotification(),
    trends: kavachDataService.getTrends(),
    kpis: kavachDataService.getKpis(),
    aiPrediction: kavachDataService.getAiPrediction(),
    isSimulating: kavachDataService.isSimulationActive(),
    setFocusedNodeId: (id) => kavachDataService.setFocusedNodeId(id),
    setInspectingNode: (node) => kavachDataService.setInspectingNode(node),
    openNodeDetails: (target) => kavachDataService.openNodeDetails(target),
    dismissCriticalPopup: () => kavachDataService.dismissCriticalPopup(),
    dismissConnectionNotification: () => kavachDataService.dismissConnectionNotification(),
    markAlertAsRead: (id) => kavachDataService.markAlertAsRead(id),
    markAllAlertsAsRead: () => kavachDataService.markAllAlertsAsRead(),
    setThresholds: (t) => kavachDataService.setThresholds(t),
    triggerSiren: (r) => kavachDataService.triggerSiren(r),
    stopSiren: () => kavachDataService.stopSiren(),
    acknowledgeAlert: (id) => kavachDataService.acknowledgeAlert(id),
    resolveAlert: (id) => kavachDataService.resolveAlert(id),
    triggerEmergencyEvacuation: () => kavachDataService.triggerEmergencyEvacuation(),
    simulateWarning: () => kavachDataService.simulateWarning(),
    simulateHighRisk: () => kavachDataService.simulateHighRisk(),
    simulateCriticalAlert: () => kavachDataService.simulateCriticalAlert(),
    addNode: (node) => kavachDataService.addNode(node),
    removeNode: (nodeId) => kavachDataService.removeNode(nodeId),
    ingestEsp32Telemetry: kavachDataService.ingestEsp32Telemetry.bind(kavachDataService),
  };

  return (
    <KavachDataContext.Provider value={value}>
      {children}
    </KavachDataContext.Provider>
  );
};

export const useKavachData = (): KavachDataContextType => {
  const ctx = useContext(KavachDataContext);
  if (!ctx) {
    throw new Error('useKavachData must be used within a KavachDataProvider');
  }
  return ctx;
};
