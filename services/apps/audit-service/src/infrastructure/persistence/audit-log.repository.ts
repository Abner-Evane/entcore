import { Injectable, Logger } from '@nestjs/common';
import { AuditLog } from '../../domain/audit-log.entity';

export interface AuditQueryFilters {
  tenantId: string;
  actorId?: string;
  from?: Date;
  to?: Date;
  action?: string;
  page?: number;
  limit?: number;
}

/**
 * In-memory stub repository for AuditLog.
 * Replace with Prisma + PostgreSQL implementation for production.
 * The table must be append-only (no UPDATE / DELETE allowed).
 */
@Injectable()
export class AuditLogRepository {
  private readonly logger = new Logger(AuditLogRepository.name);
  private readonly store: AuditLog[] = [];

  async save(entry: AuditLog): Promise<void> {
    this.store.push(entry);
    this.logger.debug(`Persisted audit entry ${entry.id}`);
  }

  async query(filters: AuditQueryFilters): Promise<{ data: AuditLog[]; total: number }> {
    let results = this.store.filter((e) => e.tenantId === filters.tenantId);

    if (filters.actorId) {
      results = results.filter((e) => e.actorId === filters.actorId);
    }
    if (filters.from) {
      results = results.filter((e) => e.occurredAt >= filters.from!);
    }
    if (filters.to) {
      results = results.filter((e) => e.occurredAt <= filters.to!);
    }
    if (filters.action) {
      results = results.filter((e) => e.action === filters.action);
    }

    const total = results.length;
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const data = results.slice((page - 1) * limit, page * limit);

    return { data, total };
  }
}
