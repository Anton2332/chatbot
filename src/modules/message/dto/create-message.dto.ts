import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { UsernameDto } from "./username.dto";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMessageDto extends UsernameDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(5000)
  @ApiProperty()
  text: string;
}
