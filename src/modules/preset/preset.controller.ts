import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PresetService } from './preset.service';
import { CreatePresetDto } from './dto/create-preset.dto';
import { PresetType } from '@prisma/client';
import { ApiOkResponse } from '@nestjs/swagger';
import { PresetResponseDto } from './dto/preset-response.dto';

@Controller('preset')
export class PresetController {
  constructor(private readonly presetService: PresetService) {}

  @Post()
  @ApiOkResponse({
    description: 'Created preset',
    type: PresetResponseDto,
    isArray: false
  })
  create(@Body() createPresetDto: CreatePresetDto) {
    return this.presetService.create(createPresetDto);
  }

  @Get('by-type')
  @ApiOkResponse({
    description: 'Presets filtered by type',
    type: PresetResponseDto,
    isArray: true
  })
  getPresetByType(@Param('type') type: PresetType) {
    return this.presetService.getPresetByType(type);
  }

  @Get('all')
  @ApiOkResponse({
    description: 'All presets',
    type: PresetResponseDto,
    isArray: true
  })
  findAll() {
    return this.presetService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.presetService.findOne(id);
  }
}
