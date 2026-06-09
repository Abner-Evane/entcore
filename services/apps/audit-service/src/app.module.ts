import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MessagingModule } from '@entcore/messaging';
import { ObservabilityModule } from '@entcore/observability';
import { RecordAuditEventUseCase } from './application/record-audit-event.use-case';
import { AuditEventHandler } from './infrastructure/nats/audit-event.handler';
import { AuditController } from './infrastructure/http/audit.controller';
import { AuditLogRepository } from './infrastructure/persistence/audit-log.repository';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MessagingModule.forRoot({
      servers: process.env.NATS_SERVERS ?? 'nats://localhost:4222',
    }),
    ObservabilityModule,
  ],
  controllers: [AuditController],
  providers: [RecordAuditEventUseCase, AuditEventHandler, AuditLogRepository],
})
export class AppModule {}
