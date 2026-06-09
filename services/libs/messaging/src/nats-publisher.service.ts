import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { NatsConnection, StringCodec } from 'nats';
import { BaseEvent } from '@entcore/contracts';
import { NATS_CONNECTION } from './nats.constants';

@Injectable()
export class NatsPublisherService implements OnModuleDestroy {
  private readonly logger = new Logger(NatsPublisherService.name);
  private readonly sc = StringCodec();

  constructor(@Inject(NATS_CONNECTION) private readonly nc: NatsConnection) {}

  /**
   * Publish a typed domain event to NATS.
   * The subject is derived from the event type; callers pass the explicit subject.
   */
  async publish<T extends BaseEvent>(subject: string, event: T): Promise<void> {
    const payload = this.sc.encode(JSON.stringify(event));
    this.nc.publish(subject, payload);
    this.logger.debug(`Published event to ${subject}: ${event.eventId}`);
  }

  /**
   * Subscribe to a NATS subject and invoke the handler for each message.
   * Returns an unsubscribe function.
   */
  subscribe<T extends BaseEvent>(
    subject: string,
    handler: (event: T) => Promise<void>,
  ): () => void {
    const sc = this.sc;
    const sub = this.nc.subscribe(subject);

    (async () => {
      for await (const msg of sub) {
        try {
          const event: T = JSON.parse(sc.decode(msg.data));
          await handler(event);
        } catch (err) {
          this.logger.error(`Error handling message on ${subject}`, err);
        }
      }
    })();

    return () => sub.unsubscribe();
  }

  async onModuleDestroy(): Promise<void> {
    await this.nc.drain();
  }
}
