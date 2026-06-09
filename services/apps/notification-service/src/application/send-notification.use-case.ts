import { Injectable, Logger } from '@nestjs/common';
import { Notification, NotificationChannel } from '../domain/notification.entity';
import { EmailProvider } from '../infrastructure/providers/email.provider';
import { OutboxService } from '../infrastructure/outbox/outbox.service';

export interface SendNotificationCommand {
  tenantId: string;
  recipientId: string;
  channels: NotificationChannel[];
  templateId: string;
  templateData: Record<string, string>;
  priority: 'low' | 'normal' | 'high';
}

@Injectable()
export class SendNotificationUseCase {
  private readonly logger = new Logger(SendNotificationUseCase.name);

  constructor(
    private readonly emailProvider: EmailProvider,
    private readonly outboxService: OutboxService,
  ) {}

  async execute(command: SendNotificationCommand): Promise<Notification> {
    const notification = new Notification(command);

    // Persist to outbox first (guarantees delivery even if provider is down)
    await this.outboxService.persist(notification);

    await this.dispatch(notification);
    return notification;
  }

  private async dispatch(notification: Notification): Promise<void> {
    for (const channel of notification.channels) {
      try {
        if (channel === 'email') {
          await this.emailProvider.send(notification);
        }
        // push and in-app channels are dispatched via their own providers (to be added)
        notification.markSent();
        await this.outboxService.markProcessed(notification.id);
      } catch (err) {
        this.logger.error(`Failed to send notification ${notification.id} via ${channel}`, err);
        notification.markFailed();
        await this.outboxService.updateStatus(notification);
      }
    }
  }
}
