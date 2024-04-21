import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { UsernameDto } from './dto/username.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get("translation/:id")
  getTranslationMessage(@Param('id') id: string) {
    return this.messageService.getTranslateMessage(id);
  }

  @Get('correct/:id')
  getCorrectMessage(@Param('id') id: string) {
    return this.messageService.getCorrectMessage(id);
  }

  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.createMessageToConversation(createMessageDto);
  }

  @Get(':username')
  findAllByUsername(@Param() param: UsernameDto) {
    return this.messageService.findAllByUsername(param.username);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(id);
  }
}
