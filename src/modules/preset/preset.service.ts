import { Injectable } from '@nestjs/common';
import { CreatePresetDto } from './dto/create-preset.dto';
import { UpdatePresetDto } from './dto/update-preset.dto';
import { PrismaService } from '@prisma';
import { PresetType } from '@prisma/client';

@Injectable()
export class PresetService {

  constructor(private readonly prismaService: PrismaService) {}

  getPresetByType(type: PresetType) {
    return this.prismaService.presets.findMany({
      where: {
        type
      }
    })
  }

  getMostRecentOnType() {
    const presetTypes = Object.keys(PresetType);
    const presetsGroupedByType = {};

    Promise.all(presetTypes.map(async (it) => {
      const type = it as PresetType;
      const fetchedPreset = await this.prismaService.presets.findMany(({
        where: {
          type
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 3
      }))
      presetTypes[type] = fetchedPreset;
    }))

    return presetsGroupedByType;
  }
  create(createPresetDto: CreatePresetDto) {
    return this.prismaService.presets.create({ data: {
      ...createPresetDto
    }})
  }

  async findAllGroupedByType() {
    const resultObject = {};
    await Promise.all(Object.keys(PresetType).map(async (key) => {
      const presetType = PresetType[key];
      resultObject[presetType] = await this.getPresetByType(presetType)
    } ))
    return resultObject;
  }

  findAll() {
    return this.prismaService.presets.findMany();
  }

  findOne(id: string) {
    return this.prismaService.presets.findUnique({ where: { id }});
  }

  remove(id: string) {
    return this.prismaService.presets.delete({where: { id }})
  }
}
