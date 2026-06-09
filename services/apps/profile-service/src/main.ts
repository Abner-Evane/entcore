import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { initTracing } from '@entcore/observability';

async function bootstrap() {
  initTracing('profile-service');
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3005;
  await app.listen(port);
  new Logger('ProfileService').log(`Profile service listening on port ${port}`);
}

bootstrap();
