import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MessagingModule } from '@entcore/messaging';
import { ObservabilityModule } from '@entcore/observability';
import { SendMessageUseCase } from './application/send-message.use-case';
import { MessagesController } from './infrastructure/http/messages.controller';
import { ThreadsController } from './infrastructure/http/threads.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MessagingModule.forRoot({
      servers: process.env.NATS_SERVERS ?? 'nats://localhost:4222',
    }),
    ObservabilityModule,
  ],
  controllers: [MessagesController, ThreadsController],
  providers: [SendMessageUseCase],
})
export class AppModule {}
