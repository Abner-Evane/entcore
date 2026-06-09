import { BaseEvent } from '../base-event.interface';

/** Subject: notification.requested.v1 */
export interface NotificationRequestedEvent extends BaseEvent {
  version: 'v1';
  payload: {
    recipientId: string;
    channels: Array<'email' | 'push' | 'in-app'>;
    templateId: string;
    templateData: Record<string, string>;
    priority: 'low' | 'normal' | 'high';
  };
}

export const NOTIFICATION_REQUESTED_SUBJECT = 'notification.requested.v1';
