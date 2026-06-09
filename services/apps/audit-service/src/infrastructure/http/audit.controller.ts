import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RecordAuditEventUseCase } from '../../application/record-audit-event.use-case';
import { AuditLogRepository } from '../persistence/audit-log.repository';
import { IngestAuditEventDto, QueryAuditLogsDto, AuditLogResponseDto } from './audit.dto';
import { AuditLog } from '../../domain/audit-log.entity';

@ApiTags('audit')
@Controller('audit')
export class AuditController {
  constructor(
    private readonly recordAuditEvent: RecordAuditEventUseCase,
    private readonly repository: AuditLogRepository,
  ) {}

  /** Ingest an audit event over HTTP (complement to NATS). */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Ingest an audit event' })
  async ingest(@Body() dto: IngestAuditEventDto): Promise<AuditLogResponseDto> {
    const entry = await this.recordAuditEvent.execute({
      ...dto,
      occurredAt: new Date(dto.occurredAt),
    });
    return this.toResponse(entry);
  }

  /** Query audit logs with filtering (tenantId required). */
  @Get()
  @ApiOperation({ summary: 'Query audit logs' })
  async query(
    @Query() filters: QueryAuditLogsDto,
  ): Promise<{ data: AuditLogResponseDto[]; total: number }> {
    const { data, total } = await this.repository.query({
      ...filters,
      from: filters.from ? new Date(filters.from) : undefined,
      to: filters.to ? new Date(filters.to) : undefined,
    });
    return { data: data.map((e) => this.toResponse(e)), total };
  }

  private toResponse(entry: AuditLog): AuditLogResponseDto {
    return {
      id: entry.id,
      tenantId: entry.tenantId,
      actorId: entry.actorId,
      actorType: entry.actorType,
      action: entry.action,
      resourceType: entry.resourceType,
      resourceId: entry.resourceId,
      outcome: entry.outcome,
      occurredAt: entry.occurredAt.toISOString(),
    };
  }
}
