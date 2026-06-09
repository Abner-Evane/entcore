import { Injectable, Logger } from '@nestjs/common';
import { Enrollment } from '../domain/class.entity';
import { NatsPublisherService } from '@entcore/messaging';
import {
  ClassEnrollmentCreatedEvent,
  CLASS_ENROLLMENT_CREATED_SUBJECT,
} from '@entcore/contracts';
import { Neo4jOrganizationRepository } from '../infrastructure/neo4j/organization.repository';
import { v4 as uuidv4 } from 'uuid';

export interface EnrollStudentCommand {
  tenantId: string;
  studentId: string;
  classId: string;
  organizationId: string;
}

@Injectable()
export class EnrollStudentUseCase {
  private readonly logger = new Logger(EnrollStudentUseCase.name);

  constructor(
    private readonly neo4jRepo: Neo4jOrganizationRepository,
    private readonly nats: NatsPublisherService,
  ) {}

  async execute(command: EnrollStudentCommand): Promise<Enrollment> {
    const enrollment = new Enrollment(command);

    // Persist relationship in Neo4j
    await this.neo4jRepo.createEnrollment(enrollment);

    // Publish domain event
    const event: ClassEnrollmentCreatedEvent = {
      eventId: uuidv4(),
      occurredAt: new Date().toISOString(),
      version: 'v1',
      source: 'organization-service',
      tenantId: command.tenantId,
      idempotencyKey: enrollment.id,
      payload: {
        enrollmentId: enrollment.id,
        studentId: enrollment.studentId,
        classId: enrollment.classId,
        organizationId: enrollment.organizationId,
        enrolledAt: enrollment.enrolledAt.toISOString(),
      },
    };

    await this.nats.publish(CLASS_ENROLLMENT_CREATED_SUBJECT, event);
    this.logger.log(`Student ${command.studentId} enrolled in class ${command.classId}`);

    return enrollment;
  }
}
