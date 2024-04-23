import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UsernameDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  username: string;
}