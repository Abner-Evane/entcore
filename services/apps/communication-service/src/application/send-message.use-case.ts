import { Injectable, Logger } from '@nestjs/common';
import { Message } from '../domain/message.entity';
import { NatsPublisherService } from '@entcore/messaging';
import {
  MessageCreatedEvent,
  MESSAGE_CREATED_SUBJECT,
} from '@entcore/contracts';
import { v4 as uuidv4 } from 'uuid';

export interface SendMessageCommand {
  tenantId: string;
  threadId: string;
  senderId: string;
  recipientIds: string[];
  body: string;
  hasAttachments?: boolean;
}

@Injectable()
export class SendMessageUseCase {
  private readonly logger = new Logger(SendMessageUseCase.name);

  constructor(private readonly nats: NatsPublisherService) {}

  async execute(command: SendMessageCommand): Promise<Message> {
    const message = new Message(command);

    // Publish domain event — notification-service and audit-service will consume it
    const event: MessageCreatedEvent = {
      eventId: uuidv4(),
      occurredAt: new Date().toISOString(),
      version: 'v1',
      source: 'communication-service',
      tenantId: command.tenantId,
      idempotencyKey: message.id,
      payload: {
        messageId: message.id,
        threadId: message.threadId,
        senderId: message.senderId,
        recipientIds: message.recipientIds,
        hasAttachments: message.hasAttachments,
      },
    };

    await this.nats.publish(MESSAGE_CREATED_SUBJECT, event);
    this.logger.log(`Message ${message.id} created in thread ${message.threadId}`);

    return message;
  }
}
