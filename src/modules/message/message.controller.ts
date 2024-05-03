import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseFilters } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PresetDto, UsernameDto } from './dto/username.dto';
import { Message } from '@prisma/client';
import { CorrectDto, ICorrect, MessageDto, TranslateDto } from './types/correct.type';
import { ApiOkResponse } from '@nestjs/swagger';
import { JWTAuthGuard } from '../common/guards';
import { AllExceptionFilter, HttpExceptionFilter } from '../common/filters';
import { User } from '../common/decorators';
import { IUser } from '../common/types';

@Controller('message')
@UseFilters(HttpExceptionFilter)
@UseFilters(AllExceptionFilter)
@UseGuards(JWTAuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get("translation/:messageId")
  @ApiOkResponse({
    description: 'Translation',
    type: TranslateDto,
    isArray: false
  })
  getTranslationMessage(@Param('messageId') id: string): Promise<TranslateDto> {
    return this.messageService.getTranslateMessage(id);
  }

  @Get('correct/:messageId')
  @ApiOkResponse({
    description: 'Correct message response',
    type: CorrectDto,
    isArray: false
  })
  getCorrectMessage(@Param('messageId') id: string): Promise<ICorrect & { id: string }>  {
    return this.messageService.getCorrectMessage(id);
  }

  @Get('summary')
  @ApiOkResponse({
    description: 'Summary message response',
    type: MessageDto,
    isArray: true
  })
  getSummaryByUsername(@User() user: IUser): Promise<MessageDto[]>  {
    return this.messageService.createSummaryMessage({ userId: user.id });
  }

  @Get('summary/:presetId')
  @ApiOkResponse({
    description: 'Summary message response',
    type: MessageDto,
    isArray: true
  })
  getSummary(@Param() dto: PresetDto, @User() user: IUser): Promise<MessageDto[]>  {
    return this.messageService.createSummaryMessage({ userId: user.id, presetId: dto.presetId });
  }

  @Post()
  @ApiOkResponse({
    description: 'Created message response',
    type: MessageDto,
    isArray: true
  })
  create(@Body() createMessageDto: CreateMessageDto, @User() user: IUser): Promise<Message[]> {
    return this.messageService.createMessageToConversation(createMessageDto, user.id);
  }

  @Delete('end-chat')
  async endChat(@Query() dto: PresetDto, @User() user: IUser) {
    await this.messageService.removeAllMessages(user.id, dto.presetId);
    return {
      message: "Chat deleted successfully"
    };
  }


  @Get()
  @ApiOkResponse({
    description: 'Correct message response',
    type: MessageDto,
    isArray: true
  })
  findAllByUsername(@User() user: IUser): Promise<Message[]> {
    return this.messageService.findAllByUsername(user.id);
  }

  @Get(':presetId')
  @ApiOkResponse({
    description: 'Correct message response',
    type: MessageDto,
    isArray: true
  })
  findAllByUsernameAndPreset(@Param() param: PresetDto, @User() user: IUser): Promise<Message[]> {
    return this.messageService.findAllByUsername(user.id, param.presetId);
  }

  @Patch(':messageId')
  @ApiOkResponse({
    description: 'Correct message response',
    type: MessageDto,
    isArray: false
  })
  update(@Param('messageId') id: string, @Body() updateMessageDto: UpdateMessageDto): Promise<Message> {
    return this.messageService.update(id, updateMessageDto);
  }

  @Delete(':messageId')
  remove(@Param('messageId') id: string) {
    return this.messageService.remove(id);
  }
}
