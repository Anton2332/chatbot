import { Module } from '@nestjs/common';
import { PresetService } from './preset.service';
import { PresetController } from './preset.controller';
import { PrismaModule } from 'src/db/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PresetController],
  providers: [PresetService],
})
export class PresetModule {}
