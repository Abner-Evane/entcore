import { BaseEvent } from '../base-event.interface';

/** Subject: message.created.v1 */
export interface MessageCreatedEvent extends BaseEvent {
  version: 'v1';
  payload: {
    messageId: string;
    threadId: string;
    senderId: string;
    recipientIds: string[];
    subject?: string;
    hasAttachments: boolean;
  };
}

export const MESSAGE_CREATED_SUBJECT = 'message.created.v1';
