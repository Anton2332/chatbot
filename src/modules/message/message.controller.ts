import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { UsernameDto } from './dto/username.dto';
import { Message } from '@prisma/client';
import { CorrectDto, ICorrect, MessageDto, TranslateDto } from './types/correct.type';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('message')
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

  @Post()
  @ApiOkResponse({
    description: 'Created message response',
    type: MessageDto,
    isArray: true
  })
  create(@Body() createMessageDto: CreateMessageDto): Promise<Message[]> {
    return this.messageService.createMessageToConversation(createMessageDto);
  }

  @Get(':username')
  @ApiOkResponse({
    description: 'Correct message response',
    type: MessageDto,
    isArray: true
  })
  findAllByUsername(@Param() param: UsernameDto): Promise<Message[]> {
    return this.messageService.findAllByUsername(param.username);
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
