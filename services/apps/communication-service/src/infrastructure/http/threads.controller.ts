import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateThreadDto, ThreadResponseDto } from './message.dto';
import { Thread } from '../../domain/thread.entity';

@ApiTags('threads')
@Controller('threads')
export class ThreadsController {
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new message thread' })
  async create(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: CreateThreadDto,
  ): Promise<ThreadResponseDto> {
    const thread = new Thread({ tenantId, ...dto });
    return {
      id: thread.id,
      tenantId: thread.tenantId,
      subject: thread.subject,
      participantIds: thread.participantIds,
      createdAt: thread.createdAt.toISOString(),
    };
  }
}
