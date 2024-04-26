import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { ConversationStyleType, EnglishLevelType, PresetType } from "@prisma/client"
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreatePresetDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(PresetType)
  type:            PresetType

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(PresetType)
  englishLevel:   EnglishLevelType


  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(PresetType)
  conversetionStyle: ConversationStyleType

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  prompt:    string;

  // @ApiPropertyOptional()
  // @IsOptional()
  // @IsString()
  // image?: String;
}