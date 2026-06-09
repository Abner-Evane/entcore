import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { initTracing } from '@entcore/observability';

async function bootstrap() {
  initTracing('identity-service');
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3006;
  await app.listen(port);
  new Logger('IdentityService').log(`Identity service listening on port ${port}`);
}

bootstrap();
