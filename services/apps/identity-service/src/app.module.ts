import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ObservabilityModule } from '@entcore/observability';

/**
 * IdentityService — stub.
 * Extracted last (most sensitive).
 * Will own: auth, sessions, roles, permissions — source of truth for accounts.
 * Gateway delegates to Java auth until this service is production-ready.
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ObservabilityModule,
  ],
})
export class AppModule {}
