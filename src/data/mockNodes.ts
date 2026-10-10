import { SensorNode } from '../types';

/**
 * Surface telemetry nodes dataset for KAVACH underground coal mine monitoring.
 * Site: Jharia Coalfield Seam #XI.
 * 
 * In accordance with real hardware demonstration requirements:
 * All sensor values initially start at ZERO (0) until ESP32 hardware transmits real readings
 * or the user triggers an explicit simulation scenario.
 */
export const INITIAL_NODES: SensorNode[] = [];

export const MINE_BOUNDARY: [number, number][] = [
  [23.7995, 86.4255],
  [23.8010, 86.4320],
  [23.7985, 86.4375],
  [23.7940, 86.4360],
  [23.7925, 86.4290],
  [23.7945, 86.4245],
];

