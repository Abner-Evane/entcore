import { v4 as uuidv4 } from 'uuid';

export type NotificationChannel = 'email' | 'push' | 'in-app';
export type NotificationStatus = 'pending' | 'sent' | 'failed' | 'dead-lettered';

export class Notification {
  id: string;
  tenantId: string;
  recipientId: string;
  channels: NotificationChannel[];
  templateId: string;
  templateData: Record<string, string>;
  priority: 'low' | 'normal' | 'high';
  status: NotificationStatus;
  attempts: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(params: {
    tenantId: string;
    recipientId: string;
    channels: NotificationChannel[];
    templateId: string;
    templateData: Record<string, string>;
    priority: 'low' | 'normal' | 'high';
  }) {
    this.id = uuidv4();
    this.tenantId = params.tenantId;
    this.recipientId = params.recipientId;
    this.channels = params.channels;
    this.templateId = params.templateId;
    this.templateData = params.templateData;
    this.priority = params.priority;
    this.status = 'pending';
    this.attempts = 0;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  markSent(): void {
    this.status = 'sent';
    this.updatedAt = new Date();
  }

  markFailed(): void {
    this.attempts += 1;
    this.status = this.attempts >= 3 ? 'dead-lettered' : 'failed';
    this.updatedAt = new Date();
  }
}
