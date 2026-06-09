import { IsString, IsArray, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty() @IsString() threadId: string;
  @ApiProperty() @IsString() senderId: string;
  @ApiProperty() @IsArray() @IsString({ each: true }) recipientIds: string[];
  @ApiProperty() @IsString() body: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() hasAttachments?: boolean;
}

export class MessageResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() tenantId: string;
  @ApiProperty() threadId: string;
  @ApiProperty() senderId: string;
  @ApiProperty() recipientIds: string[];
  @ApiProperty() hasAttachments: boolean;
  @ApiProperty() createdAt: string;
}

export class CreateThreadDto {
  @ApiProperty() @IsString() subject: string;
  @ApiProperty() @IsArray() @IsString({ each: true }) participantIds: string[];
}

export class ThreadResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() tenantId: string;
  @ApiProperty() subject: string;
  @ApiProperty() participantIds: string[];
  @ApiProperty() createdAt: string;
}
