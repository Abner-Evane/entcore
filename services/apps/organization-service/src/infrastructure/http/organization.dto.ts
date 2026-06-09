import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrganizationDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() uai: string;
  @ApiProperty({ enum: ['school', 'college', 'lycee', 'other'] })
  @IsEnum(['school', 'college', 'lycee', 'other'])
  type: 'school' | 'college' | 'lycee' | 'other';
  @ApiPropertyOptional() @IsOptional() @IsString() address?: string;
}

export class OrganizationResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() tenantId: string;
  @ApiProperty() name: string;
  @ApiProperty() uai: string;
  @ApiProperty() type: string;
  @ApiPropertyOptional() address?: string;
  @ApiProperty() createdAt: string;
}

export class EnrollStudentDto {
  @ApiProperty() @IsString() studentId: string;
  @ApiProperty() @IsString() classId: string;
  @ApiProperty() @IsString() organizationId: string;
}

export class EnrollmentResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() tenantId: string;
  @ApiProperty() studentId: string;
  @ApiProperty() classId: string;
  @ApiProperty() organizationId: string;
  @ApiProperty() enrolledAt: string;
}
