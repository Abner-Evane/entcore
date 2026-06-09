import { v4 as uuidv4 } from 'uuid';

export type ActorType = 'user' | 'system';
export type Outcome = 'success' | 'failure';

export class AuditLog {
  id: string;
  tenantId: string;
  actorId: string;
  actorType: ActorType;
  action: string;
  resourceType: string;
  resourceId: string;
  outcome: Outcome;
  metadata: Record<string, string>;
  occurredAt: Date;
  createdAt: Date;

  constructor(params: {
    tenantId: string;
    actorId: string;
    actorType: ActorType;
    action: string;
    resourceType: string;
    resourceId: string;
    outcome: Outcome;
    metadata?: Record<string, string>;
    occurredAt: Date;
  }) {
    this.id = uuidv4();
    this.tenantId = params.tenantId;
    this.actorId = params.actorId;
    this.actorType = params.actorType;
    this.action = params.action;
    this.resourceType = params.resourceType;
    this.resourceId = params.resourceId;
    this.outcome = params.outcome;
    this.metadata = params.metadata ?? {};
    this.occurredAt = params.occurredAt;
    this.createdAt = new Date();
  }
}
