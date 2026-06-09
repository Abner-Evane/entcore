/**
 * Base interface that every NATS domain event must satisfy.
 * Rules:
 *  - eventId: UUID v4
 *  - occurredAt: ISO-8601 string
 *  - version: e.g. "v1"
 *  - source: publishing service name
 *  - tenantId: multi-tenant identifier
 *  - idempotencyKey: allows consumers to deduplicate
 */
export interface BaseEvent {
  eventId: string;
  occurredAt: string;
  version: string;
  source: string;
  tenantId: string;
  idempotencyKey: string;
}
