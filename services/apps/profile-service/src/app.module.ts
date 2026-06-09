import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ObservabilityModule } from '@entcore/observability';

/**
 * ProfileService — stub.
 * Extracted after organization-service.
 * Will own: student/teacher/parent profiles, preferences, school affiliation.
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ObservabilityModule,
  ],
})
export class AppModule {}
