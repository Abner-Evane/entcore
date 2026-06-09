import { v4 as uuidv4 } from 'uuid';

export class Class {
  id: string;
  tenantId: string;
  organizationId: string;
  name: string;
  level: string;
  schoolYear: string;
  createdAt: Date;

  constructor(params: {
    tenantId: string;
    organizationId: string;
    name: string;
    level: string;
    schoolYear: string;
  }) {
    this.id = uuidv4();
    this.tenantId = params.tenantId;
    this.organizationId = params.organizationId;
    this.name = params.name;
    this.level = params.level;
    this.schoolYear = params.schoolYear;
    this.createdAt = new Date();
  }
}

export class Enrollment {
  id: string;
  tenantId: string;
  studentId: string;
  classId: string;
  organizationId: string;
  enrolledAt: Date;

  constructor(params: {
    tenantId: string;
    studentId: string;
    classId: string;
    organizationId: string;
  }) {
    this.id = uuidv4();
    this.tenantId = params.tenantId;
    this.studentId = params.studentId;
    this.classId = params.classId;
    this.organizationId = params.organizationId;
    this.enrolledAt = new Date();
  }
}
