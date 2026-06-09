import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MessagingModule } from '@entcore/messaging';
import { ObservabilityModule } from '@entcore/observability';
import { SendNotificationUseCase } from './application/send-notification.use-case';
import { MessageCreatedHandler } from './infrastructure/nats/message-created.handler';
import { UserCreatedHandler } from './infrastructure/nats/user-created.handler';
import { EmailProvider } from './infrastructure/providers/email.provider';
import { OutboxService } from './infrastructure/outbox/outbox.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MessagingModule.forRoot({
      servers: process.env.NATS_SERVERS ?? 'nats://localhost:4222',
    }),
    ObservabilityModule,
  ],
  providers: [
    SendNotificationUseCase,
    MessageCreatedHandler,
    UserCreatedHandler,
    EmailProvider,
    OutboxService,
  ],
})
export class AppModule {}
