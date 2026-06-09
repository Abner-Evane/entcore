import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MessagingModule } from '@entcore/messaging';
import { ObservabilityModule } from '@entcore/observability';
import { Neo4jModule } from './infrastructure/neo4j/neo4j.module';
import { Neo4jOrganizationRepository } from './infrastructure/neo4j/organization.repository';
import { EnrollStudentUseCase } from './application/enroll-student.use-case';
import { OrganizationsController } from './infrastructure/http/organizations.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MessagingModule.forRoot({
      servers: process.env.NATS_SERVERS ?? 'nats://localhost:4222',
    }),
    ObservabilityModule,
    Neo4jModule,
  ],
  controllers: [OrganizationsController],
  providers: [Neo4jOrganizationRepository, EnrollStudentUseCase],
})
export class AppModule {}
