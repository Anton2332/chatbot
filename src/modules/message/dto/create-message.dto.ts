import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { UsernameDto } from "./username.dto";

export class CreateMessageDto extends UsernameDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(5000)
  text: string;
}
