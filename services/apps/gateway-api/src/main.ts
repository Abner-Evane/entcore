import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { initTracing } from '@entcore/observability';
import { HttpExceptionFilter, LoggingInterceptor } from '@entcore/common';

async function bootstrap() {
  initTracing('gateway-api');

  const app = await NestFactory.create(AppModule);
  const logger = new Logger('GatewayAPI');

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Entcore Gateway API')
    .setDescription('BFF gateway — routes to Java monolith and NestJS microservices')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Gateway API listening on port ${port}`);
}

bootstrap();
