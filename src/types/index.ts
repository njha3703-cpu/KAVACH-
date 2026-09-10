export type UserRole = 'Admin' | 'Mine Safety Officer' | 'Mine Operator';

export interface User {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  designation: string;
  site: string;
}

export type RiskLevel = 'NORMAL' | 'WARNING' | 'HIGH' | 'CRITICAL';
export type AlertSeverity = 'WATCH' | 'WARNING' | 'HIGH' | 'CRITICAL';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved';
export type NotificationReadState = 'UNREAD' | 'READ' | 'RESOLVED';

export interface NodeLocation {
  latitude: number;
  longitude: number;
  zone: string;
  elevation?: number;
}

export interface NodeSensors {
  tiltX: number;
  tiltY: number;
  tiltZ: number;
  tiltMagnitude: number; // calculated combined degrees
  vibration: number;     // mm/s Peak Particle Velocity
  displacement: number;  // mm cumulative surface movement
  crack: boolean;        // continuous optical/potentiometric crack sensor
  battery: number;       // percentage 0 - 100
  temperature?: number;  // °C ambient rock/surface temp
}

export interface RateOfChange {
  tiltRate: number;        // deg/hour
  vibrationRate: number;   // (mm/s)/hour
  displacementRate: number;// mm/hour
  tiltTrend: 'increasing' | 'decreasing' | 'stable';
  vibrationTrend: 'increasing' | 'decreasing' | 'stable';
  displacementTrend: 'increasing' | 'decreasing' | 'stable';
}

export interface SensorNode {
  id: string;             // e.g., "NODE_27"
  label: string;          // e.g., "Node 27"
  location: NodeLocation;
  sensors: NodeSensors;
  previousSensors?: NodeSensors;
  rateOfChange: RateOfChange;
  battery: number;
  connectivity: 'WiFi' | 'GSM' | 'Mesh' | 'Offline';
  status: 'Online' | 'Offline' | 'Warning' | 'Critical';
  riskLevel: RiskLevel;
  riskScore: number;       // 0 to 100
  lastUpdated: string;
  isHighRisk?: boolean;
}

export interface Alert {
  id: string;
  nodeId: string;
  nodeLabel: string;
  zone: string;
  severity: AlertSeverity;
  title: string;
  reason: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  riskScore: number;
  status: AlertStatus;
  readState?: NotificationReadState;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  sensorSnapshot?: Partial<NodeSensors>;
}

export interface SirenState {
  command: 'TRIGGER_BUZZER' | 'STOP_BUZZER';
  timestamp: string;
  status: 'ACTIVE' | 'INACTIVE';
  isSimulated: boolean;
  reason?: string;
  activeNodeId?: string;
}

export interface SystemHealth {
  gatewayStatus: 'ONLINE' | 'STANDBY' | 'OFFLINE';
  wifiStatus: 'CONNECTED' | 'DISCONNECTED';
  gsmStatus: 'CONNECTED' | 'STANDBY' | 'OFFLINE';
  cloudStatus: 'CONNECTED' | 'CACHED' | 'DISCONNECTED';
  sensorNetworkOnline: number;
  sensorNetworkTotal: number;
  databaseStatus: 'CONNECTED' | 'SIMULATION' | 'OFFLINE';
  lastSync: string;
  isOnline?: boolean;
  serverAvailable?: boolean;
  offlineQueueCount?: number;
  syncState?: 'IDLE' | 'PENDING_SYNC' | 'SYNCING' | 'SYNCED' | 'FAILED_RETRY';
}

export interface AiPredictionData {
  predictedZone: string;
  estimatedSeverity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  expectedProgression: string; // e.g. "3–7 days"
  riskScore: number;
  confidence: number;
  affectedNodes: string[];
  anomalies: string[];
  recommendedActions: string[];
  disclaimer: string;
}

export type SupportedLanguage = 'en' | 'hi' | 'mr' | 'bn' | 'ta' | 'te';

export interface TrendPoint {
  time: string;
  Node12: number;
  Node16: number;
  Node27: number;
  Node34: number;
}

export interface CrackTrendPoint {
  time: string;
  opened: number;
  criticalThreshold: number;
}

export interface TrendDataset {
  tilt: TrendPoint[];
  displacement: TrendPoint[];
  vibration: TrendPoint[];
  crack: CrackTrendPoint[];
}

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
}
