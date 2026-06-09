import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpCode,
  HttpStatus,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Organization } from '../../domain/organization.entity';
import { Neo4jOrganizationRepository } from '../neo4j/organization.repository';
import { EnrollStudentUseCase } from '../../application/enroll-student.use-case';
import {
  CreateOrganizationDto,
  OrganizationResponseDto,
  EnrollStudentDto,
  EnrollmentResponseDto,
} from './organization.dto';

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly neo4jRepo: Neo4jOrganizationRepository,
    private readonly enrollStudent: EnrollStudentUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create an organization (établissement)' })
  async create(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: CreateOrganizationDto,
  ): Promise<OrganizationResponseDto> {
    const org = new Organization({ tenantId, ...dto });
    await this.neo4jRepo.createOrganization(org);
    return {
      id: org.id,
      tenantId: org.tenantId,
      name: org.name,
      uai: org.uai,
      type: org.type,
      address: org.address,
      createdAt: org.createdAt.toISOString(),
    };
  }

  @Post(':id/enrollments')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Enroll a student in a class' })
  async enroll(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: EnrollStudentDto,
  ): Promise<EnrollmentResponseDto> {
    const enrollment = await this.enrollStudent.execute({ tenantId, ...dto });
    return {
      id: enrollment.id,
      tenantId: enrollment.tenantId,
      studentId: enrollment.studentId,
      classId: enrollment.classId,
      organizationId: enrollment.organizationId,
      enrolledAt: enrollment.enrolledAt.toISOString(),
    };
  }

  @Get(':id/classes/:classId/members')
  @ApiOperation({ summary: 'Get members of a class (Neo4j graph query)' })
  async getClassMembers(
    @Headers('x-tenant-id') tenantId: string,
    @Param('classId') classId: string,
  ): Promise<{ studentIds: string[] }> {
    const studentIds = await this.neo4jRepo.getClassMembers(classId, tenantId);
    return { studentIds };
  }
}
