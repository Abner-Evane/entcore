import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SendMessageUseCase } from '../../application/send-message.use-case';
import { CreateMessageDto, MessageResponseDto } from './message.dto';
import { Message } from '../../domain/message.entity';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly sendMessage: SendMessageUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Send a message within a thread' })
  async create(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: CreateMessageDto,
  ): Promise<MessageResponseDto> {
    const message = await this.sendMessage.execute({ tenantId, ...dto });
    return this.toResponse(message);
  }

  private toResponse(message: Message): MessageResponseDto {
    return {
      id: message.id,
      tenantId: message.tenantId,
      threadId: message.threadId,
      senderId: message.senderId,
      recipientIds: message.recipientIds,
      hasAttachments: message.hasAttachments,
      createdAt: message.createdAt.toISOString(),
    };
  }
}
