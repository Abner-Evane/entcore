import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { initTracing } from '@entcore/observability';
import { HttpExceptionFilter, LoggingInterceptor } from '@entcore/common';

async function bootstrap() {
  initTracing('communication-service');

  const app = await NestFactory.create(AppModule);
  const logger = new Logger('CommunicationService');

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Communication Service')
    .setDescription('Messaging API — threads, messages, attachments')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3003;
  await app.listen(port);
  logger.log(`Communication service listening on port ${port}`);
}

bootstrap();
