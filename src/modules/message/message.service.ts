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
    this.AIServiceUrl = this.configService.get("AI_SERVICE_URL") ?? 'https://fsh-services-1051463fdac7.herokuapp.com/';
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
    await this.update(findMessage.id, { correct: corrected.corrected, explanation: corrected.explanation });
    return { id, ...corrected };
  }

  async getResponseMessage(messages: {role: CHAT_ROLE, content: string }[], presetName?: string) {
    const corrected = await unirest.post(this.AIServiceUrl + "chat_correct").headers(HEADERS).send({ name: presetName, messages: messages });
    if (corrected.code !== 200) {
      console.log(corrected.body);
      throw new HttpException("The server responded with incorrect status code", 500);
    }
    return corrected.body;
  }

  async getSummaryMessage({ messages }: {messages: string[] }) {
    const corrected = await unirest.post(this.AIServiceUrl + "summarize").headers(HEADERS).send({ messages: messages });
    if (corrected.code !== 200) {
      console.log(corrected.body);
      throw new HttpException("The server responded with incorrect status code", 500);
    }
    return corrected.body;
  }

  async createSummaryMessage({ username, presetId }: {username: string, presetId?: string}) {
    const findMessages = await this.findAllByUsername(username, presetId,false);
    const explanations = findMessages.filter((it) => it.rating >= 1).map((it) => it.explanation);
    const result = await this.getSummaryMessage({ messages: explanations })
    const message = await this.create({
      username, presetId, text: result.summary, isSummary: true,
      isResponse: true
    })
    return [message]
  }

  async createMessageToConversation(createMessageDto: CreateMessageDto): Promise<Message[]> {
    const userMessages = await this.findAllByUsername(createMessageDto.username);
      const messages = userMessages.map((it) => ({ role: it.isResponse ? CHAT_ROLE.ASSISTANT : CHAT_ROLE.USER, content: it.text }))
      messages.push({ role: CHAT_ROLE.USER, content: createMessageDto.text })
      const preset = await this.prismaService.presets.findFirst({ where: {
        id: createMessageDto.presetId
      }})
      const result = await this.getResponseMessage(messages, preset?.nameForAiService);
      const userMessage = await this.create({ ...createMessageDto, correct: result.corrected, explanation: result.explanation, rating: result.rating, isResponse: false });
      const responseMessage = await this.create({ username: createMessageDto.username, text: result.responce, isResponse: true, presetId: createMessageDto.presetId });
      return [userMessage, responseMessage];
  }

  async create(createMessageDto: CreateMessageDto & { isResponse: boolean }): Promise<Message> {
    const { presetId, username, ...rest} = createMessageDto;
    return this.prismaService.message.create({data: {
      ...rest,
      ...(createMessageDto.presetId && { preset: { connect: { id: createMessageDto.presetId } } }),
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

  async findAllByUsername(username: string, presetId?: string, isResponse?: boolean, isSummary?: boolean) {
    return this.prismaService.message.findMany({ where: { user: { username }, presetId, ...(typeof isResponse !== 'undefined' && { isResponse }), ...(typeof isSummary !== 'undefined' && { isSummary }) }, orderBy: { createdAt: 'asc' } });
  }
  async removeAllMessages(username: string, presetId?: string) {
    return this.prismaService.message.findMany({ where: { user: { username }, presetId }})
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
