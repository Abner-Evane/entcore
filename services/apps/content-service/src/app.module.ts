import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ObservabilityModule } from '@entcore/observability';

/**
 * ContentService — stub.
 * Will own: pedagogical resources, folders, document access rights.
 * May point to external object storage (S3-compatible).
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ObservabilityModule,
  ],
})
export class AppModule {}
