import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Driver, Session } from 'neo4j-driver';
import { NEO4J_DRIVER } from './neo4j.module';
import { Organization } from '../../domain/organization.entity';
import { Enrollment } from '../../domain/class.entity';

/**
 * Neo4j repository for organization-service.
 *
 * Node labels:
 *   (:Organization {id, tenantId, name, uai, type})
 *   (:Class       {id, tenantId, organizationId, name, level, schoolYear})
 *   (:Student     {id, tenantId})
 *
 * Relationships:
 *   (:Class)-[:BELONGS_TO]->(:Organization)
 *   (:Student)-[:ENROLLED_IN {enrollmentId, enrolledAt}]->(:Class)
 *
 * Indexes / constraints (run once during migration):
 *   CREATE CONSTRAINT org_id   IF NOT EXISTS FOR (o:Organization) REQUIRE o.id IS UNIQUE;
 *   CREATE CONSTRAINT class_id IF NOT EXISTS FOR (c:Class)         REQUIRE c.id IS UNIQUE;
 *   CREATE INDEX org_tenant    IF NOT EXISTS FOR (o:Organization)  ON (o.tenantId);
 */
@Injectable()
export class Neo4jOrganizationRepository implements OnModuleDestroy {
  private readonly logger = new Logger(Neo4jOrganizationRepository.name);

  constructor(@Inject(NEO4J_DRIVER) private readonly driver: Driver) {}

  async createOrganization(org: Organization): Promise<void> {
    const session: Session = this.driver.session();
    try {
      await session.run(
        `MERGE (o:Organization {id: $id})
         SET o.tenantId = $tenantId, o.name = $name, o.uai = $uai, o.type = $type`,
        { id: org.id, tenantId: org.tenantId, name: org.name, uai: org.uai, type: org.type },
      );
    } finally {
      await session.close();
    }
  }

  async createEnrollment(enrollment: Enrollment): Promise<void> {
    const session: Session = this.driver.session();
    try {
      await session.run(
        `MERGE (s:Student {id: $studentId, tenantId: $tenantId})
         MERGE (c:Class   {id: $classId,   tenantId: $tenantId})
         MERGE (s)-[r:ENROLLED_IN {enrollmentId: $enrollmentId}]->(c)
         SET r.enrolledAt = $enrolledAt`,
        {
          studentId: enrollment.studentId,
          tenantId: enrollment.tenantId,
          classId: enrollment.classId,
          enrollmentId: enrollment.id,
          enrolledAt: enrollment.enrolledAt.toISOString(),
        },
      );
      this.logger.debug(`Created enrollment ${enrollment.id} in Neo4j`);
    } finally {
      await session.close();
    }
  }

  async getClassMembers(classId: string, tenantId: string): Promise<string[]> {
    const session: Session = this.driver.session();
    try {
      const result = await session.run(
        `MATCH (s:Student)-[:ENROLLED_IN]->(c:Class {id: $classId, tenantId: $tenantId})
         RETURN s.id AS studentId`,
        { classId, tenantId },
      );
      return result.records.map((r) => r.get('studentId') as string);
    } finally {
      await session.close();
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.driver.close();
  }
}
