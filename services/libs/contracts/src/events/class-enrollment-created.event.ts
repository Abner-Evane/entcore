import { BaseEvent } from '../base-event.interface';

/** Subject: class.enrollment.created.v1 */
export interface ClassEnrollmentCreatedEvent extends BaseEvent {
  version: 'v1';
  payload: {
    enrollmentId: string;
    studentId: string;
    classId: string;
    organizationId: string;
    enrolledAt: string;
  };
}

export const CLASS_ENROLLMENT_CREATED_SUBJECT = 'class.enrollment.created.v1';
