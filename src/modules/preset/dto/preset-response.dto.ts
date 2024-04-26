import { ApiProperty } from "@nestjs/swagger";
import { CreatePresetDto } from "./create-preset.dto";
import { IsNotEmpty, IsString } from "class-validator";

export class PresetResponseDto extends CreatePresetDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}