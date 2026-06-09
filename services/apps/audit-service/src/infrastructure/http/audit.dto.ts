import {
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class QueryAuditLogsDto {
  @ApiProperty({ description: 'Tenant identifier' })
  @IsString()
  tenantId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  actorId?: string;

  @ApiPropertyOptional({ description: 'ISO-8601 start date' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({ description: 'ISO-8601 end date' })
  @IsOptional()
  @IsDateString()
  to?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  action?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}

export class AuditLogResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() tenantId: string;
  @ApiProperty() actorId: string;
  @ApiProperty() actorType: string;
  @ApiProperty() action: string;
  @ApiProperty() resourceType: string;
  @ApiProperty() resourceId: string;
  @ApiProperty() outcome: string;
  @ApiProperty() occurredAt: string;
}

export class IngestAuditEventDto {
  @ApiProperty() @IsString() tenantId: string;
  @ApiProperty() @IsString() actorId: string;
  @ApiProperty() @IsEnum(['user', 'system']) actorType: 'user' | 'system';
  @ApiProperty() @IsString() action: string;
  @ApiProperty() @IsString() resourceType: string;
  @ApiProperty() @IsString() resourceId: string;
  @ApiProperty() @IsEnum(['success', 'failure']) outcome: 'success' | 'failure';
  @ApiPropertyOptional() @IsOptional() metadata?: Record<string, string>;
  @ApiProperty() @IsDateString() occurredAt: string;
}
