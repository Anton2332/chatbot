import { PartialType } from '@nestjs/swagger';
import { CreateMessageDto } from './create-message.dto';
import { IsUUID } from 'class-validator';

export class UpdateMessageDto extends PartialType(CreateMessageDto) {
  @IsUUID()
  id: string;
}
