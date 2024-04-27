import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateMessageDto } from './create-message.dto';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateMessageDto extends PartialType(CreateMessageDto) {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  translation?: string;
}
