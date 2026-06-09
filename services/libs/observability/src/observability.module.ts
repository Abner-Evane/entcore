import { Module } from '@nestjs/common';

/**
 * ObservabilityModule is intentionally empty at the module level.
 * Tracing is initialized early via initTracing() in each service's main.ts,
 * before the NestJS application boots.
 */
@Module({})
export class ObservabilityModule {}
