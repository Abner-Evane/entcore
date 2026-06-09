import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { initTracing } from '@entcore/observability';

async function bootstrap() {
  initTracing('notification-service');

  const app = await NestFactory.create(AppModule);
  const logger = new Logger('NotificationService');

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  logger.log(`Notification service listening on port ${port}`);
}

bootstrap();
