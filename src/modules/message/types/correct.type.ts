import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export interface ICorrect { corrected: string; explanation: string; original: string }

export class TranslateDto {
  @ApiProperty()
  id: string; 
  @ApiProperty()
  original: string; 
  @ApiProperty()
  translated: string 
}

export class CorrectDto { 
  @ApiProperty()
  id: string; 
  @ApiProperty()
  corrected: string; 
  @ApiProperty()
  explanation: string; 
  @ApiProperty()
  original: string 
}

export class MessageDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  isResponse: boolean;
  @ApiProperty()
  text: string;
  @ApiProperty()
  createdAt: Date;
  @ApiPropertyOptional()
  correct: string;
  @ApiPropertyOptional()
  explanation: string;
  @ApiPropertyOptional()
  translation: string;
  @ApiProperty()
  userId: string;
}