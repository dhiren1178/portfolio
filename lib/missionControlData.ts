export type TelemetryStatus = "nominal" | "active" | "idle";

export interface StatusRow {
  id: string;
  label: string;
  value: string;
  status: TelemetryStatus;
}

export interface MetricRow {
  id: string;
  label: string;
  baseValue: number;
  decimals: number;
  suffix: string;
  jitter: number; // max +/- amount applied on each tick
  status: TelemetryStatus;
}

// Rows that are meaningfully "on/off" states, not numbers.
export const statusRows: StatusRow[] = [
  { id: "mission", label: "Mission Status", value: "ONLINE", status: "nominal" },
  { id: "satellite", label: "Satellite", value: "CONNECTED", status: "nominal" },
  { id: "engine", label: "AI Engine", value: "RUNNING", status: "active" },
  { id: "scan", label: "Vegetation Scan", value: "ACTIVE", status: "active" },
];

// Rows rendered with AnimatedNumber and given small live jitter so the
// dashboard reads as a running system rather than a printed screenshot.
export const metricRows: MetricRow[] = [
  { id: "altitude", label: "Altitude", baseValue: 705, decimals: 0, suffix: " KM", jitter: 0.6, status: "nominal" },
  { id: "confidence", label: "Confidence", baseValue: 96.2, decimals: 1, suffix: "%", jitter: 0.3, status: "active" },
  { id: "orbit", label: "Orbit Number", baseValue: 17421, decimals: 0, suffix: "", jitter: 0, status: "nominal" },
  { id: "inference", label: "Inference Speed", baseValue: 42, decimals: 0, suffix: " MS", jitter: 4, status: "active" },
];

const STATUS_COLOR: Record<TelemetryStatus, string> = {
  nominal: "#4CAF7D",
  active: "#5EEAD4",
  idle: "#5B6472",
};

export function statusColor(status: TelemetryStatus): string {
  return STATUS_COLOR[status];
}
