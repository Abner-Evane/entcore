import { BaseEvent } from '../base-event.interface';

/** Subject: audit.event.created.v1 */
export interface AuditEventCreatedEvent extends BaseEvent {
  version: 'v1';
  payload: {
    actorId: string;
    actorType: 'user' | 'system';
    action: string;
    resourceType: string;
    resourceId: string;
    outcome: 'success' | 'failure';
    metadata?: Record<string, string>;
  };
}

export const AUDIT_EVENT_CREATED_SUBJECT = 'audit.event.created.v1';
