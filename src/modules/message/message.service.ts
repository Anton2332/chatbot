import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from '@prisma';
import { Message } from '@prisma/client';

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

  findAllByUsername(username: string) {
    return this.prismaService.message.findMany({where: { user: { username}}});
  }

  update(id: string, updateMessageDto: UpdateMessageDto) {
    return this.prismaService.message.update({ where: { id }, data: updateMessageDto})
  }

  remove(id: string) {
    return this.prismaService.message.delete({where: {id}})
  }
}
