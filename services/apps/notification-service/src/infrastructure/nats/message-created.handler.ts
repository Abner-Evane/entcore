import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { NatsPublisherService } from '@entcore/messaging';
import {
  MessageCreatedEvent,
  MESSAGE_CREATED_SUBJECT,
} from '@entcore/contracts';
import { SendNotificationUseCase } from '../../application/send-notification.use-case';

@Injectable()
export class MessageCreatedHandler implements OnModuleInit {
  private readonly logger = new Logger(MessageCreatedHandler.name);
  private unsubscribe?: () => void;

  constructor(
    private readonly nats: NatsPublisherService,
    private readonly sendNotification: SendNotificationUseCase,
  ) {}

  onModuleInit(): void {
    this.unsubscribe = this.nats.subscribe<MessageCreatedEvent>(
      MESSAGE_CREATED_SUBJECT,
      async (event) => {
        this.logger.log(`Handling ${MESSAGE_CREATED_SUBJECT}: ${event.eventId}`);
        await this.sendNotification.execute({
          tenantId: event.tenantId,
          recipientId: event.payload.recipientIds[0], // simplified: first recipient
          channels: ['in-app', 'email'],
          templateId: 'message.received',
          templateData: {
            senderId: event.payload.senderId,
            subject: event.payload.subject ?? '',
          },
          priority: 'normal',
        });
      },
    );
  }

  onModuleDestroy(): void {
    this.unsubscribe?.();
  }
}
