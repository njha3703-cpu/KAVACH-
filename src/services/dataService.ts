import { SensorNode, Alert, SirenState, SystemHealth, AiPredictionData, TrendPoint } from '../types';
import { INITIAL_NODES } from '../data/mockNodes';
import { INITIAL_ALERTS } from '../data/mockAlerts';
import { TILT_TRENDS, DISPLACEMENT_TRENDS, VIBRATION_TRENDS, CRACK_EVENTS } from '../data/mockTrends';
import { calculateNodeRisk, calculateRateOfChange, generateAiSubsidencePrediction, SensorThresholds, DEFAULT_THRESHOLDS } from '../ai/riskEngine';
import { audioSynthesizer } from './audioAlert';
import { offlineStorage } from './offlineStorage';

type DataChangeListener = () => void;

class KavachDataService {
  private nodes: SensorNode[] = [];
  private alerts: Alert[] = [];
  private sirenState: SirenState = {
    command: 'STOP_BUZZER',
    timestamp: new Date().toLocaleTimeString(),
    status: 'INACTIVE',
    isSimulated: true,
  };
  private systemHealth: SystemHealth = {
    gatewayStatus: 'ONLINE',
    wifiStatus: 'CONNECTED',
    gsmStatus: 'STANDBY',
    cloudStatus: 'CONNECTED',
    sensorNetworkOnline: 5,
    sensorNetworkTotal: 5,
    databaseStatus: 'CONNECTED',
    lastSync: 'Just now',
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    serverAvailable: true,
    offlineQueueCount: 0,
    syncState: 'IDLE',
  };
  private thresholds: SensorThresholds = { ...DEFAULT_THRESHOLDS };
  private focusedNodeId: string | null = 'NODE_27';
  private inspectingNode: SensorNode | null = null;
  private criticalPopupAlert: Alert | null = null;
  private isSimulating: boolean = false;
  private simulationInterval: any = null;
  private listeners: Set<DataChangeListener> = new Set();
  private wasOffline: boolean = false;
  private connectionNotification: { type: 'RESTORED' | 'SYNCED' | null; message: string | null } = {
    type: null,
    message: null,
  };
  private trends = {
    tilt: [...TILT_TRENDS],
    displacement: [...DISPLACEMENT_TRENDS],
    vibration: [...VIBRATION_TRENDS],
    crack: [...CRACK_EVENTS],
  };

  constructor() {
    // 5. SENSOR VALUES MUST INITIALLY BE ZERO
    this.nodes = JSON.parse(JSON.stringify(INITIAL_NODES));
    // Initial alerts start with UNREAD state
    this.alerts = JSON.parse(JSON.stringify(INITIAL_ALERTS)).map((a: Alert) => ({
      ...a,
      readState: a.status === 'resolved' ? 'RESOLVED' : 'UNREAD',
    }));
    // Start with NO active critical popup until triggered
    this.criticalPopupAlert = null;

    this.initOfflineAndNetwork();
  }

  private async initOfflineAndNetwork() {
    // Attempt to load offline cached data if available
    try {
      const cachedNodes = await offlineStorage.loadNodes();
      if (cachedNodes && cachedNodes.length > 0) {
        this.nodes = cachedNodes;
      }
      const cachedAlerts = await offlineStorage.loadAlerts();
      if (cachedAlerts && cachedAlerts.length > 0) {
        this.alerts = cachedAlerts;
      }
      const pendingQueue = await offlineStorage.getPendingQueue();
      this.systemHealth.offlineQueueCount = pendingQueue.length;
      if (pendingQueue.length > 0) {
        this.systemHealth.syncState = 'PENDING_SYNC';
      }
      this.notify();
    } catch (e) {
      console.warn('Offline storage load error', e);
    }

    // Bind browser connectivity listeners
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleNetworkOnline());
      window.addEventListener('offline', () => this.handleNetworkOffline());
    }
  }

  private async handleNetworkOnline() {
    this.systemHealth.isOnline = true;
    this.systemHealth.wifiStatus = 'CONNECTED';
    this.systemHealth.cloudStatus = 'CONNECTED';
    this.systemHealth.databaseStatus = 'CONNECTED';
    this.systemHealth.serverAvailable = true;

    // Only show connection restored notification if system was actually offline!
    if (this.wasOffline) {
      this.wasOffline = false;
      this.systemHealth.syncState = 'SYNCING';
      this.connectionNotification = {
        type: 'RESTORED',
        message: 'Internet/server connection is back. Synchronizing stored data...',
      };
      this.notify();

      // Process pending queue from offline storage
      try {
        const queue = await offlineStorage.getPendingQueue();
        if (queue.length > 0) {
          for (const item of queue) {
            await offlineStorage.updateQueueState(item.id, 'SYNCING');
            // Ingest item into live state if not already present
            if (item.payload) {
              this.applyTelemetryPayload(item.payload);
            }
            await offlineStorage.updateQueueState(item.id, 'SYNCED');
          }
        }
      } catch (e) {
        console.warn('Error synchronizing pending records', e);
      }

      this.systemHealth.syncState = 'SYNCED';
      this.systemHealth.offlineQueueCount = 0;
      this.connectionNotification = {
        type: 'SYNCED',
        message: 'All pending records have been synchronized successfully.',
      };
      this.notify();

      setTimeout(() => {
        this.connectionNotification = { type: null, message: null };
        this.systemHealth.syncState = 'IDLE';
        this.notify();
      }, 5000);
    } else {
      this.notify();
    }
  }

  private handleNetworkOffline() {
    this.wasOffline = true;
    this.systemHealth.isOnline = false;
    this.systemHealth.wifiStatus = 'DISCONNECTED';
    this.systemHealth.cloudStatus = 'CACHED';
    this.systemHealth.databaseStatus = 'OFFLINE';
    this.systemHealth.serverAvailable = false;
    this.notify();
  }

  private persistState() {
    try {
      offlineStorage.saveNodes(this.nodes);
      offlineStorage.saveAlerts(this.alerts);
    } catch {
      // ignore
    }
  }

  public subscribe(listener: DataChangeListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  // Getters
  public getNodes(): SensorNode[] {
    return this.nodes;
  }

  public getAlerts(): Alert[] {
    return this.alerts;
  }

  public getSirenState(): SirenState {
    return this.sirenState;
  }

  public getSystemHealth(): SystemHealth {
    return {
      ...this.systemHealth,
      sensorNetworkOnline: this.nodes.filter(n => n.status !== 'Offline').length,
      sensorNetworkTotal: this.nodes.length,
    };
  }

  public getThresholds(): SensorThresholds {
    return this.thresholds;
  }

  public getFocusedNodeId(): string | null {
    return this.focusedNodeId;
  }

  public getInspectingNode(): SensorNode | null {
    return this.inspectingNode;
  }

  public getCriticalPopupAlert(): Alert | null {
    return this.criticalPopupAlert;
  }

  public getConnectionNotification() {
    return this.connectionNotification;
  }

  public dismissConnectionNotification() {
    this.connectionNotification = { type: null, message: null };
    this.notify();
  }

  public getTrends() {
    return this.trends;
  }

  public isSimulationActive(): boolean {
    return this.isSimulating;
  }

  public setFocusedNodeId(id: string | null) {
    this.focusedNodeId = id;
    this.notify();
  }

  public setInspectingNode(node: SensorNode | null) {
    this.inspectingNode = node;
    if (node) {
      this.focusedNodeId = node.id;
    }
    this.notify();
  }

  public openNodeDetails(target: string | SensorNode) {
    const node = typeof target === 'string'
      ? this.nodes.find(n => n.id === target) || null
      : target;
    if (node) {
      this.focusedNodeId = node.id;
      this.inspectingNode = node;
      this.notify();
    }
  }

  public dismissCriticalPopup() {
    this.criticalPopupAlert = null;
    this.notify();
  }

  public setThresholds(newThresholds: Partial<SensorThresholds>) {
    this.thresholds = { ...this.thresholds, ...newThresholds };
    this.recalculateAllNodes();
    this.persistState();
    this.notify();
  }

  private recalculateAllNodes() {
    this.nodes = this.nodes.map(node => {
      if (node.status === 'Offline') return node;
      const riskCalc = calculateNodeRisk(node.sensors, node.rateOfChange, this.thresholds);
      return {
        ...node,
        riskScore: riskCalc.riskScore,
        riskLevel: riskCalc.riskLevel,
        isHighRisk: riskCalc.riskLevel === 'HIGH' || riskCalc.riskLevel === 'CRITICAL',
      };
    });
  }

  // Dynamic Node Management (Requirement 6)
  public addNode(node: SensorNode) {
    if (!this.nodes.some(n => n.id === node.id)) {
      this.nodes = [...this.nodes, node];
      this.systemHealth.lastSync = 'Just now';
      this.notify();
    }
  }

  public removeNode(nodeId: string) {
    this.nodes = this.nodes.filter(n => n.id !== nodeId);
    if (this.focusedNodeId === nodeId) {
      this.focusedNodeId = this.nodes[0]?.id || null;
    }
    this.systemHealth.lastSync = 'Just now';
    this.notify();
  }

  // KPI Calculations (Strictly Dynamic - Requirement 5 & 6)
  public getKpis() {
    const total = this.nodes.length;
    const online = this.nodes.filter(n => n.status !== 'Offline').length;
    const offline = total - online;

    const onlineNodes = this.nodes.filter(n => n.status !== 'Offline');
    const avgTilt = onlineNodes.length > 0
      ? (onlineNodes.reduce((acc, n) => acc + n.sensors.tiltMagnitude, 0) / onlineNodes.length).toFixed(2)
      : '0.00';
    const avgVibration = onlineNodes.length > 0
      ? (onlineNodes.reduce((acc, n) => acc + n.sensors.vibration, 0) / onlineNodes.length).toFixed(2)
      : '0.00';
    const maxDisplacement = onlineNodes.length > 0
      ? Math.max(...onlineNodes.map(n => n.sensors.displacement)).toFixed(1)
      : '0.0';

    const riskZonesCount = new Set(
      this.nodes.filter(n => n.riskLevel === 'CRITICAL' || n.riskLevel === 'HIGH').map(n => n.location.zone)
    ).size;

    return {
      totalNodes: total,
      onlineNodes: online,
      offlineNodes: offline,
      avgTilt,
      avgVibration,
      maxDisplacement,
      riskZonesCount,
    };
  }

  public getAiPrediction(): AiPredictionData {
    return generateAiSubsidencePrediction(this.nodes);
  }

  // Siren Control Architecture (Requirements 3, 13, 15, 16)
  public triggerSiren(reason: string = 'Operator Manual Test', activeNodeId?: string) {
    this.sirenState = {
      command: 'TRIGGER_BUZZER',
      timestamp: new Date().toLocaleTimeString(),
      status: 'ACTIVE',
      isSimulated: true,
      reason,
      activeNodeId,
    };
    audioSynthesizer.playSiren();
    this.notify();
  }

  public stopSiren() {
    this.sirenState = {
      command: 'STOP_BUZZER',
      timestamp: new Date().toLocaleTimeString(),
      status: 'INACTIVE',
      isSimulated: true,
    };
    audioSynthesizer.stop();
    // Dismiss critical popup when siren is stopped by operator
    this.criticalPopupAlert = null;
    this.notify();
  }

  // Synchronized Alert Actions (Requirements 5, 6, 7)
  public markAlertAsRead(id: string) {
    this.alerts = this.alerts.map(a => {
      if (a.id === id && a.status !== 'resolved') {
        return { ...a, readState: 'READ' as const };
      }
      return a;
    });
    this.persistState();
    this.notify();
  }

  public markAllAlertsAsRead() {
    this.alerts = this.alerts.map(a => {
      if (a.status !== 'resolved') {
        return { ...a, readState: 'READ' as const };
      }
      return a;
    });
    this.persistState();
    this.notify();
  }

  public getUnreadAlertCount(): number {
    return this.alerts.filter(a => a.status !== 'resolved' && (a.readState === 'UNREAD' || !a.readState)).length;
  }

  public getActiveAlerts(): Alert[] {
    return this.alerts.filter(a => a.status !== 'resolved');
  }

  public getAlertHistory(): Alert[] {
    return this.alerts;
  }

  public acknowledgeAlert(id: string, operatorName: string = 'Safety Officer') {
    this.alerts = this.alerts.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: 'acknowledged' as const,
          readState: 'READ' as const,
          acknowledgedBy: operatorName,
          acknowledgedAt: new Date().toLocaleTimeString(),
        };
      }
      return a;
    });
    this.persistState();
    this.notify();
  }

  public resolveAlert(id: string, operatorName: string = 'Safety Officer') {
    this.alerts = this.alerts.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: 'resolved' as const,
          readState: 'RESOLVED' as const,
          resolvedBy: operatorName,
          resolvedAt: new Date().toLocaleTimeString(),
        };
      }
      return a;
    });
    if (this.criticalPopupAlert?.id === id) {
      this.criticalPopupAlert = null;
    }
    this.persistState();
    this.notify();
  }

  // Emergency Evacuation Alert
  public triggerEmergencyEvacuation() {
    const alert: Alert = {
      id: `ALT_EMERGENCY_${Date.now()}`,
      nodeId: 'ALL_NODES',
      nodeLabel: 'Perimeter Wide',
      zone: 'Entire Surface Mine',
      severity: 'CRITICAL',
      title: 'EMERGENCY EVACUATION ORDER',
      reason: 'Mine Safety Officer triggered site-wide emergency subsidence evacuation protocol',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      latitude: 23.7956,
      longitude: 86.4304,
      riskScore: 99,
      status: 'active',
    };
    this.alerts = [alert, ...this.alerts];
    this.criticalPopupAlert = alert;
    this.triggerSiren('EMERGENCY EVACUATION ORDER TRIGGERED');
    this.notify();
  }

  // 9. SIMULATE WARNING
  public simulateWarning() {
    const target = this.nodes.find(n => n.id === 'NODE_16') || this.nodes[0];
    if (!target) return;
    target.sensors.tiltMagnitude = 1.95;
    target.sensors.tiltX = 1.6;
    target.sensors.tiltY = 0.8;
    target.sensors.vibration = 1.65;
    target.sensors.displacement = 1.8;
    target.status = 'Warning';
    target.rateOfChange.tiltTrend = 'increasing';
    target.rateOfChange.tiltRate = 0.35;
    const risk = calculateNodeRisk(target.sensors, target.rateOfChange, this.thresholds);
    target.riskScore = Math.max(55, risk.riskScore);
    target.riskLevel = 'WARNING';
    target.lastUpdated = 'Just now (Demo Warning)';

    const newAlert: Alert = {
      id: `ALT_WARN_${Date.now()}`,
      nodeId: target.id,
      nodeLabel: target.label,
      zone: target.location.zone,
      severity: 'WARNING',
      title: 'Warning: Abnormal Tilt Escalation',
      reason: `${target.label} – Tilt value reached ${target.sensors.tiltMagnitude}° (threshold ${this.thresholds.tiltWarning}°)`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      latitude: target.location.latitude,
      longitude: target.location.longitude,
      riskScore: target.riskScore,
      status: 'active',
      sensorSnapshot: { ...target.sensors },
    };
    this.alerts = [newAlert, ...this.alerts];
    this.focusedNodeId = target.id;
    this.systemHealth.lastSync = 'Just now';
    this.notify();
  }

  // 10. SIMULATE HIGH RISK
  public simulateHighRisk() {
    const target = this.nodes.find(n => n.id === 'NODE_34') || this.nodes[0];
    if (!target) return;
    target.sensors.vibration = 2.45;
    target.sensors.displacement = 2.8;
    target.sensors.tiltMagnitude = 1.85;
    target.sensors.tiltX = 1.5;
    target.sensors.tiltY = 1.1;
    target.status = 'Warning';
    target.rateOfChange.vibrationTrend = 'increasing';
    target.rateOfChange.displacementTrend = 'increasing';
    const risk = calculateNodeRisk(target.sensors, target.rateOfChange, this.thresholds);
    target.riskScore = Math.max(72, risk.riskScore);
    target.riskLevel = 'HIGH';
    target.isHighRisk = true;
    target.lastUpdated = 'Just now (Demo High Risk)';

    const newAlert: Alert = {
      id: `ALT_HIGH_${Date.now()}`,
      nodeId: target.id,
      nodeLabel: target.label,
      zone: target.location.zone,
      severity: 'HIGH',
      title: 'High Risk Seismic & Displacement Surge',
      reason: `${target.label} – Vibration ${target.sensors.vibration} mm/s & Displacement ${target.sensors.displacement} mm`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      latitude: target.location.latitude,
      longitude: target.location.longitude,
      riskScore: target.riskScore,
      status: 'active',
      sensorSnapshot: { ...target.sensors },
    };
    this.alerts = [newAlert, ...this.alerts];
    this.focusedNodeId = target.id;
    this.systemHealth.lastSync = 'Just now';
    this.notify();
  }

  // 11. SIMULATE CRITICAL ALERT + SIREN (Immediate 1-click sequence)
  public simulateCriticalAlert() {
    let target = this.nodes.find(n => n.id === 'NODE_27');
    if (!target && this.nodes.length > 0) {
      target = this.nodes[0];
    }
    if (!target) return;

    // 1. Node becomes CRITICAL
    target.sensors.tiltMagnitude = 2.45;
    target.sensors.tiltX = 2.2;
    target.sensors.tiltY = 1.1;
    target.sensors.tiltZ = 0.3;
    target.sensors.vibration = 3.1;
    target.sensors.displacement = 4.2;
    target.sensors.crack = true;
    target.status = 'Critical';
    target.riskLevel = 'CRITICAL';
    target.riskScore = 89;
    target.isHighRisk = true;
    target.lastUpdated = 'Just now (Critical Trigger)';
    target.rateOfChange = {
      tiltRate: 0.65,
      vibrationRate: 1.2,
      displacementRate: 1.45,
      tiltTrend: 'increasing',
      vibrationTrend: 'increasing',
      displacementTrend: 'increasing',
    };

    // 2. Critical Alert Object
    const newAlert: Alert = {
      id: `ALT_CRIT_${Date.now()}`,
      nodeId: target.id,
      nodeLabel: target.label,
      zone: target.location.zone,
      severity: 'CRITICAL',
      title: 'High Risk Zone Detected',
      reason: 'Rapid increase in tilt + vibration + displacement',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      latitude: target.location.latitude,
      longitude: target.location.longitude,
      riskScore: target.riskScore,
      status: 'active',
      sensorSnapshot: { ...target.sensors },
    };

    // 3. Update alert feeds
    this.alerts = [newAlert, ...this.alerts];
    // 4. Critical Alert Popup appears immediately
    this.criticalPopupAlert = newAlert;
    // 5. Map focuses on affected node
    this.focusedNodeId = target.id;

    // 6. SIREN STARTS IMMEDIATELY (no extra click!)
    this.triggerSiren(`Subsidence progression detected at ${target.label} (${target.location.zone})`, target.id);

    // 7. Push trend data spike
    const nowLabel = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.trends.tilt.push({
      time: nowLabel,
      Node12: 0.1,
      Node16: 1.85,
      Node27: 2.45,
      Node34: 1.35,
    });
    if (this.trends.tilt.length > 8) this.trends.tilt.shift();

    this.systemHealth.lastSync = 'Just now';
    this.notify();
  }

  /**
   * Hardware Integration Endpoint: Ingests raw packet from ESP32 Gateway via ESP-NOW
   */
  public ingestEsp32Telemetry(payload: {
    nodeId: string;
    timestamp?: string;
    location?: { latitude: number; longitude: number; zone?: string };
    sensors: {
      tiltX: number;
      tiltY: number;
      tiltZ?: number;
      vibration: number;
      displacement: number;
      crack: boolean;
      battery?: number;
    };
    battery?: number;
    connectivity?: 'WiFi' | 'GSM' | 'Mesh' | 'Offline';
  }) {
    const existingIndex = this.nodes.findIndex(n => n.id === payload.nodeId);
    const tiltMagnitude = Number(
      Math.sqrt(
        Math.pow(payload.sensors.tiltX, 2) + Math.pow(payload.sensors.tiltY, 2)
      ).toFixed(2)
    );

    const fullSensors = {
      tiltX: payload.sensors.tiltX,
      tiltY: payload.sensors.tiltY,
      tiltZ: payload.sensors.tiltZ || 0,
      tiltMagnitude,
      vibration: payload.sensors.vibration,
      displacement: payload.sensors.displacement,
      crack: payload.sensors.crack,
      battery: payload.battery || payload.sensors.battery || 85,
      temperature: 30,
    };

    if (!this.systemHealth.isOnline) {
      // Ingest while offline: store in persistent queue
      offlineStorage.enqueueTelemetry(payload.nodeId, payload);
      this.systemHealth.offlineQueueCount = (this.systemHealth.offlineQueueCount || 0) + 1;
      this.systemHealth.syncState = 'PENDING_SYNC';
    }

    this.applyTelemetryPayload(payload, fullSensors);
  }

  private applyTelemetryPayload(payload: any, computedSensors?: any) {
    const existingIndex = this.nodes.findIndex(n => n.id === payload.nodeId);
    const fullSensors = computedSensors || {
      tiltX: payload.sensors.tiltX,
      tiltY: payload.sensors.tiltY,
      tiltZ: payload.sensors.tiltZ || 0,
      tiltMagnitude: Number(
        Math.sqrt(
          Math.pow(payload.sensors.tiltX, 2) + Math.pow(payload.sensors.tiltY, 2)
        ).toFixed(2)
      ),
      vibration: payload.sensors.vibration,
      displacement: payload.sensors.displacement,
      crack: payload.sensors.crack,
      battery: payload.battery || payload.sensors?.battery || 85,
      temperature: 30,
    };

    if (existingIndex >= 0) {
      const existing = this.nodes[existingIndex];
      const rate = calculateRateOfChange(fullSensors, existing.sensors, 0.1);
      const risk = calculateNodeRisk(fullSensors, rate, this.thresholds);

      this.nodes[existingIndex] = {
        ...existing,
        sensors: fullSensors,
        previousSensors: existing.sensors,
        rateOfChange: rate,
        riskScore: risk.riskScore,
        riskLevel: risk.riskLevel,
        isHighRisk: risk.riskLevel === 'CRITICAL' || risk.riskLevel === 'HIGH',
        battery: fullSensors.battery,
        connectivity: payload.connectivity || existing.connectivity,
        status: risk.riskLevel === 'CRITICAL' ? 'Critical' : risk.riskLevel === 'HIGH' || risk.riskLevel === 'WARNING' ? 'Warning' : 'Online',
        lastUpdated: 'Just now (Hardware Ingest)',
      };
    } else {
      // Dynamic addition of previously unseen ESP32 nodes
      const rate = calculateRateOfChange(fullSensors);
      const risk = calculateNodeRisk(fullSensors, rate, this.thresholds);
      const newNode: SensorNode = {
        id: payload.nodeId,
        label: payload.nodeId.replace('NODE_', 'Node '),
        location: {
          latitude: payload.location?.latitude || 23.795,
          longitude: payload.location?.longitude || 86.43,
          zone: payload.location?.zone || 'Zone 3B',
        },
        sensors: fullSensors,
        rateOfChange: rate,
        battery: fullSensors.battery,
        connectivity: payload.connectivity || 'WiFi',
        status: risk.riskLevel === 'CRITICAL' ? 'Critical' : 'Online',
        riskLevel: risk.riskLevel,
        riskScore: risk.riskScore,
        lastUpdated: 'Just now (Hardware Ingest)',
      };
      this.nodes.push(newNode);
    }

    // 18. CRACK SENSOR IN ALERTS: Check if crack is triggered
    if (fullSensors.crack) {
      const existingCrackAlert = this.alerts.find(
        a => a.nodeId === payload.nodeId && a.title.includes('CRACK') && a.status === 'active'
      );
      if (!existingCrackAlert) {
        const crackAlert: Alert = {
          id: `ALT_CRACK_${Date.now()}_${payload.nodeId}`,
          nodeId: payload.nodeId,
          nodeLabel: payload.nodeId.replace('NODE_', 'Node '),
          zone: payload.location?.zone || 'Surface Zone',
          severity: 'HIGH',
          title: 'CRACK DETECTED',
          reason: `${payload.nodeId} – Conductive tape crack sensor triggered. Surface fracture identified.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          latitude: payload.location?.latitude || 23.795,
          longitude: payload.location?.longitude || 86.43,
          riskScore: 78,
          status: 'active',
          readState: 'UNREAD',
          sensorSnapshot: { ...fullSensors },
        };
        this.alerts = [crackAlert, ...this.alerts];
      }
    }

    this.persistState();
    this.systemHealth.lastSync = 'Just now';
    this.notify();
  }
}

export const kavachDataService = new KavachDataService();
