import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from '@prisma';

@Injectable()
export class MessageService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createMessageDto: CreateMessageDto) {
    return this.prismaService.message.create({data: {
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
