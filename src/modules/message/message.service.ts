import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from '@prisma';
import { Message } from '@prisma/client';

const unirest = require('unirest');

@Injectable()
export class MessageService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message[]> {
    const createdMessage = await this.prismaService.message.create({data: {
      text: createMessageDto.text,
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
    }})

    return [createdMessage]
  }

  async findAllByUsername(username: string) {


    const translated = await unirest.post("https://a1ca-2a02-2f07-7207-b800-d54b-3fd2-2153-45e3.ngrok-free.app/translate").headers({
    "Content-Type": "application/json"
  }).send({
    message:"Hello, world and Python",
    language:"uk"
  })

  console.log(translated.body);

    return this.prismaService.message.findMany({where: { user: { username}}});
  }

  update(id: string, updateMessageDto: UpdateMessageDto) {
    return this.prismaService.message.update({ where: { id }, data: updateMessageDto})
  }

  remove(id: string) {
    return this.prismaService.message.delete({where: {id}})
  }
}
