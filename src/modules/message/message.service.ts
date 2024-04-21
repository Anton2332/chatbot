import { HttpCode, HttpException, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from '@prisma';
import { Message } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { CHAT_ROLE, DEFAULT_MESSAGE, HEADERS } from '../common/constants';
import { STATUS_CODES } from 'http';
import { ICorrect } from './types/correct.type';

const unirest = require('unirest');

@Injectable()
export class MessageService {
  private AIServiceUrl: string;
  constructor(private readonly prismaService: PrismaService, private readonly configService: ConfigService) {
    this.AIServiceUrl = this.configService.getOrThrow("AI_SERVICE_URL");
  }

  async translateRequest(text: string) {
    const translated = await unirest.post(this.AIServiceUrl + "translate").headers(HEADERS).send(JSON.stringify({
      message: text,
      language:"uk"
    }));
    if (translated.code !== 200) {
      throw new HttpException("The server responded with incorrect status code", 500);
    }
    return translated.body.translated;
  }

  async getTranslateMessage(id: string) {
    const findMessage = await this.findOne(id);
    if (findMessage.translation) {
      return {
        id: findMessage.id,
        original: findMessage.text,
        translated: findMessage.translation
      };
    }
    const translated = await this.translateRequest(findMessage.text);
    await this.update(findMessage.id, { translation: translated });
    return {id, original: findMessage.text, translated };
  }

  async correctRequest(text: string): Promise<ICorrect> {
    const translated = await unirest.post(this.AIServiceUrl + "correct").headers(HEADERS).send({
      message: text,
      language:"uk"
    });
    if (translated.code !== 200) {
      throw new HttpException("The server responded with incorrect status code", 500);
    }
    return translated.body;
  }

  async getCorrectMessage(id: string): Promise<ICorrect & { id: string }> {
    const findMessage = await this.findOne(id);
    if (findMessage.correct && findMessage.explanation) {
      return {
        id: findMessage.id,
        original: findMessage.text,
        explanation: findMessage.explanation,
        corrected: findMessage.correct
      };
    }
    const corrected = await this.correctRequest(findMessage.text);
    await this.update(findMessage.id, { correct: corrected.corrected });
    return { id, ...corrected };
  }

  async getResponseMessage(messages: {role: CHAT_ROLE, content: string }[]) {
    const corrected = await unirest.post(this.AIServiceUrl + "chat").headers(HEADERS).send({ messages: messages });
    if (corrected.code !== 200) {
      throw new HttpException("The server responded with incorrect status code", 500);
    }
    return corrected.body.responce;
  }

  async createMessageToConversation(createMessageDto: CreateMessageDto): Promise<Message[]> {
    const userMessages = await this.findAllByUsername(createMessageDto.username);
    if (userMessages.length) {
      const messages = userMessages.map((it) => ({ role: it.isResponse ? CHAT_ROLE.ASSISTANT : CHAT_ROLE.USER, content: it.text }))
      messages.push({ role: CHAT_ROLE.USER, content: createMessageDto.text })
      const response = await this.getResponseMessage(messages);
      const userMessage = await this.create({ ...createMessageDto, isResponse: false });
      const responseMessage = await this.create({ username: createMessageDto.username, text: response, isResponse: true });
      return [userMessage, responseMessage];
    }

    const messages = [{ role: CHAT_ROLE.ASSISTANT, content: DEFAULT_MESSAGE }];
    messages.push({ role: CHAT_ROLE.USER, content: createMessageDto.text });
    const response = await this.getResponseMessage(messages);
    const firstMessage = await this.create({ username: createMessageDto.username, text: DEFAULT_MESSAGE, isResponse: true });
    const userMessage = await this.create({ ...createMessageDto, isResponse: false });
    const responseMessage = await this.create({ username: createMessageDto.username, text: response, isResponse: true });
    return [firstMessage, userMessage, responseMessage];
  }

  async create(createMessageDto: CreateMessageDto & { isResponse: boolean }): Promise<Message> {
    return this.prismaService.message.create({data: {
      text: createMessageDto.text,
      isResponse: createMessageDto.isResponse,
      user: {
        connectOrCreate : {
          where: {
            username: createMessageDto.username
          },
          create: {
            username: createMessageDto.username
          }
        }
      }
    }});
  }

  async findAllByUsername(username: string) {
    return this.prismaService.message.findMany({ where: { user: { username } }, orderBy: { createdAt: 'asc' } });
  }

  findOne(id: string) {
    return this.prismaService.message.findUnique({ where: { id } })
  }

  update(id: string, updateMessageDto: UpdateMessageDto) {
    return this.prismaService.message.update({ where: { id }, data: updateMessageDto})
  }

  remove(id: string) {
    return this.prismaService.message.delete({where: {id}})
  }
}
