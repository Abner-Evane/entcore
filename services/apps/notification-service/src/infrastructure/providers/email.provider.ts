import { Injectable, Logger } from '@nestjs/common';
import { Notification } from '../../domain/notification.entity';

/**
 * Stub email provider.
 * Replace with real SMTP/SES/Mailgun integration in production.
 */
@Injectable()
export class EmailProvider {
  private readonly logger = new Logger(EmailProvider.name);

  async send(notification: Notification): Promise<void> {
    this.logger.log(
      `[EMAIL] Sending template "${notification.templateId}" to user ${notification.recipientId} (tenant: ${notification.tenantId})`,
    );
    // TODO: integrate with SMTP / SES / Mailgun
  }
}
