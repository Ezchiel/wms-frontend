export type NotificationSeverity = 'CRITICAL' | 'WARNING' | 'INFO';
export type NotificationType = 'LOW_STOCK' | 'EXPIRING_STOCK';

export interface NotificationSummary {
  type: NotificationType;
  title: string;
  message: string;
  severity: NotificationSeverity;
  referenceId: number;
  referenceType: 'PRODUCT' | 'STOCK';
  daysRemaining?: number | null;
}

export interface NotificationState {
  items: NotificationSummary[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}
