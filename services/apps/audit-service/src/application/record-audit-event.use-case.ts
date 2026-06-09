import { Injectable, Logger } from '@nestjs/common';
import { AuditLog } from '../domain/audit-log.entity';
import { AuditLogRepository } from '../infrastructure/persistence/audit-log.repository';

export interface RecordAuditEventCommand {
  tenantId: string;
  actorId: string;
  actorType: 'user' | 'system';
  action: string;
  resourceType: string;
  resourceId: string;
  outcome: 'success' | 'failure';
  metadata?: Record<string, string>;
  occurredAt: Date;
}

@Injectable()
export class RecordAuditEventUseCase {
  private readonly logger = new Logger(RecordAuditEventUseCase.name);

  constructor(private readonly repository: AuditLogRepository) {}

  async execute(command: RecordAuditEventCommand): Promise<AuditLog> {
    const entry = new AuditLog(command);
    await this.repository.save(entry);
    this.logger.log(`Audit: recorded ${command.action} on ${command.resourceType}/${command.resourceId}`);
    return entry;
  }
}
