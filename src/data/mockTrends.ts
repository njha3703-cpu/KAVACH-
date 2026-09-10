export interface TrendPoint {
  time: string;
  Node12: number;
  Node16: number;
  Node27: number;
  Node34: number;
}

export const TILT_TRENDS: TrendPoint[] = [
  { time: '6 AM', Node12: 0.19, Node16: 0.95, Node27: 0.85, Node34: 0.65 },
  { time: '9 AM', Node12: 0.20, Node16: 1.10, Node27: 1.05, Node34: 0.72 },
  { time: '12 PM', Node12: 0.21, Node16: 1.35, Node27: 1.48, Node34: 0.88 },
  { time: '3 PM', Node12: 0.22, Node16: 1.55, Node27: 1.72, Node34: 0.98 },
  { time: '6 PM', Node12: 0.21, Node16: 1.70, Node27: 1.95, Node34: 1.10 },
  { time: '9 PM', Node12: 0.21, Node16: 1.80, Node27: 2.10, Node34: 1.20 },
];

export const DISPLACEMENT_TRENDS: TrendPoint[] = [
  { time: '6 AM', Node12: 0.3, Node16: 0.6, Node27: 1.1, Node34: 0.5 },
  { time: '9 AM', Node12: 0.3, Node16: 0.8, Node27: 1.5, Node34: 0.7 },
  { time: '12 PM', Node12: 0.4, Node16: 1.0, Node27: 2.1, Node34: 0.9 },
  { time: '3 PM', Node12: 0.4, Node16: 1.2, Node27: 2.6, Node34: 1.1 },
  { time: '6 PM', Node12: 0.4, Node16: 1.4, Node27: 2.9, Node34: 1.3 },
  { time: '9 PM', Node12: 0.4, Node16: 1.6, Node27: 3.2, Node34: 1.4 },
];

export const VIBRATION_TRENDS: TrendPoint[] = [
  { time: '6 AM', Node12: 0.55, Node16: 0.82, Node27: 1.20, Node34: 1.10 },
  { time: '9 AM', Node12: 0.60, Node16: 0.95, Node27: 1.65, Node34: 1.35 },
  { time: '12 PM', Node12: 0.62, Node16: 1.12, Node27: 2.10, Node34: 1.60 },
  { time: '3 PM', Node12: 0.58, Node16: 1.28, Node27: 2.35, Node34: 1.85 },
  { time: '6 PM', Node12: 0.61, Node16: 1.39, Node27: 2.50, Node34: 1.75 },
  { time: '9 PM', Node12: 0.62, Node16: 1.45, Node27: 2.60, Node34: 1.90 },
];

export const CRACK_EVENTS = [
  { time: '6 AM', opened: 0, criticalThreshold: 5 },
  { time: '9 AM', opened: 0, criticalThreshold: 5 },
  { time: '12 PM', opened: 1, criticalThreshold: 5 },
  { time: '3 PM', opened: 1, criticalThreshold: 5 },
  { time: '6 PM', opened: 2, criticalThreshold: 5 },
  { time: '9 PM', opened: 3, criticalThreshold: 5 },
];
