export interface OperationalMetrics {
  openCases: number;
  docsPendingAI: number;
}

export interface ExternalAccessEvent {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
}
