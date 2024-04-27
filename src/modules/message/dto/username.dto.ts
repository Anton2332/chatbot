import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UsernameDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  username: string;
}

export class PresetDto extends UsernameDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  presetId?: string;
}