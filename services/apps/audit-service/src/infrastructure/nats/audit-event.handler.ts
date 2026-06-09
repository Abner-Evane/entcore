import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { NatsPublisherService } from '@entcore/messaging';
import { AuditEventCreatedEvent, AUDIT_EVENT_CREATED_SUBJECT } from '@entcore/contracts';
import { RecordAuditEventUseCase } from '../../application/record-audit-event.use-case';

@Injectable()
export class AuditEventHandler implements OnModuleInit {
  private readonly logger = new Logger(AuditEventHandler.name);
  private unsubscribe?: () => void;

  constructor(
    private readonly nats: NatsPublisherService,
    private readonly recordAuditEvent: RecordAuditEventUseCase,
  ) {}

  onModuleInit(): void {
    this.unsubscribe = this.nats.subscribe<AuditEventCreatedEvent>(
      AUDIT_EVENT_CREATED_SUBJECT,
      async (event) => {
        this.logger.log(`Handling ${AUDIT_EVENT_CREATED_SUBJECT}: ${event.eventId}`);
        await this.recordAuditEvent.execute({
          tenantId: event.tenantId,
          actorId: event.payload.actorId,
          actorType: event.payload.actorType,
          action: event.payload.action,
          resourceType: event.payload.resourceType,
          resourceId: event.payload.resourceId,
          outcome: event.payload.outcome,
          metadata: event.payload.metadata,
          occurredAt: new Date(event.occurredAt),
        });
      },
    );
  }

  onModuleDestroy(): void {
    this.unsubscribe?.();
  }
}
