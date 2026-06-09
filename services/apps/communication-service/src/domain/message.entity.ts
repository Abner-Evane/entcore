import { v4 as uuidv4 } from 'uuid';

export class Message {
  id: string;
  tenantId: string;
  threadId: string;
  senderId: string;
  recipientIds: string[];
  body: string;
  hasAttachments: boolean;
  createdAt: Date;

  constructor(params: {
    tenantId: string;
    threadId: string;
    senderId: string;
    recipientIds: string[];
    body: string;
    hasAttachments?: boolean;
  }) {
    this.id = uuidv4();
    this.tenantId = params.tenantId;
    this.threadId = params.threadId;
    this.senderId = params.senderId;
    this.recipientIds = params.recipientIds;
    this.body = params.body;
    this.hasAttachments = params.hasAttachments ?? false;
    this.createdAt = new Date();
  }
}
