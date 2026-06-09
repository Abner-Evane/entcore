import { Injectable, Logger } from '@nestjs/common';
import { Notification } from '../../domain/notification.entity';

/**
 * OutboxService provides the outbox pattern for reliable notification delivery.
 *
 * In production, this must be backed by a persistent store (Prisma/PostgreSQL)
 * so that notifications survive process restarts and can be retried on failure.
 * The in-memory implementation below is a stub for local development.
 */
@Injectable()
export class OutboxService {
  private readonly logger = new Logger(OutboxService.name);
  private readonly store = new Map<string, Notification>();

  async persist(notification: Notification): Promise<void> {
    this.store.set(notification.id, notification);
    this.logger.debug(`Outbox: persisted notification ${notification.id}`);
  }

  async markProcessed(id: string): Promise<void> {
    this.store.delete(id);
    this.logger.debug(`Outbox: marked processed ${id}`);
  }

  async updateStatus(notification: Notification): Promise<void> {
    this.store.set(notification.id, notification);
    this.logger.debug(`Outbox: updated status for ${notification.id} → ${notification.status}`);
  }

  /** Returns all pending/failed notifications for retry. */
  async getPending(): Promise<Notification[]> {
    return Array.from(this.store.values()).filter(
      (n) => n.status === 'pending' || n.status === 'failed',
    );
  }
}
