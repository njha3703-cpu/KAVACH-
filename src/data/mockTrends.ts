export interface TrendPoint {
  time: string;
  [nodeId: string]: number | string;
}

export const TILT_TRENDS: TrendPoint[] = [
  { time: '6 AM', N1: 0.15, N2: 0.10 },
  { time: '9 AM', N1: 0.18, N2: 0.12 },
  { time: '12 PM', N1: 0.22, N2: 0.15 },
  { time: '3 PM', N1: 0.28, N2: 0.19 },
  { time: '6 PM', N1: 0.34, N2: 0.24 },
  { time: '9 PM', N1: 0.40, N2: 0.30 },
];

export const DISPLACEMENT_TRENDS: TrendPoint[] = [
  { time: '6 AM', N1: 0.4, N2: 0.2 },
  { time: '9 AM', N1: 0.6, N2: 0.3 },
  { time: '12 PM', N1: 0.9, N2: 0.5 },
  { time: '3 PM', N1: 1.2, N2: 0.7 },
  { time: '6 PM', N1: 1.5, N2: 0.9 },
  { time: '9 PM', N1: 1.8, N2: 1.1 },
];

export const VIBRATION_TRENDS: TrendPoint[] = [
  { time: '6 AM', N1: 0.3, N2: 0.2 },
  { time: '9 AM', N1: 0.4, N2: 0.25 },
  { time: '12 PM', N1: 0.5, N2: 0.3 },
  { time: '3 PM', N1: 0.55, N2: 0.35 },
  { time: '6 PM', N1: 0.6, N2: 0.4 },
  { time: '9 PM', N1: 0.65, N2: 0.45 },
];

export const CRACK_EVENTS = [
  { time: '6 AM', opened: 0, criticalThreshold: 5 },
  { time: '9 AM', opened: 0, criticalThreshold: 5 },
  { time: '12 PM', opened: 0, criticalThreshold: 5 },
  { time: '3 PM', opened: 0, criticalThreshold: 5 },
  { time: '6 PM', opened: 0, criticalThreshold: 5 },
  { time: '9 PM', opened: 0, criticalThreshold: 5 },
];