import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { UsernameDto } from "./username.dto";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateMessageDto extends UsernameDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(5000)
  @ApiProperty()
  text: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  presetId?: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  isSummary?: boolean;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  rating?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  correct?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  explanation?: string;
}
