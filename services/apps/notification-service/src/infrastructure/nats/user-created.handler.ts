import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { NatsPublisherService } from '@entcore/messaging';
import { UserCreatedEvent, USER_CREATED_SUBJECT } from '@entcore/contracts';
import { SendNotificationUseCase } from '../../application/send-notification.use-case';

@Injectable()
export class UserCreatedHandler implements OnModuleInit {
  private readonly logger = new Logger(UserCreatedHandler.name);
  private unsubscribe?: () => void;

  constructor(
    private readonly nats: NatsPublisherService,
    private readonly sendNotification: SendNotificationUseCase,
  ) {}

  onModuleInit(): void {
    this.unsubscribe = this.nats.subscribe<UserCreatedEvent>(
      USER_CREATED_SUBJECT,
      async (event) => {
        this.logger.log(`Handling ${USER_CREATED_SUBJECT}: ${event.eventId}`);
        await this.sendNotification.execute({
          tenantId: event.tenantId,
          recipientId: event.payload.userId,
          channels: ['email'],
          templateId: 'user.welcome',
          templateData: { email: event.payload.email },
          priority: 'high',
        });
      },
    );
  }

  onModuleDestroy(): void {
    this.unsubscribe?.();
  }
}
