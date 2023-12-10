export interface Notification {
  type: NotificationType;
  message: string;
}

export enum NotificationType {
  Success = 'success',
  Error = 'error',
}
