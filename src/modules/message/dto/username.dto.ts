import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class UsernameDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  @ApiProperty()
  userId: string;
}

export class PresetDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  presetId?: string;
}