import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaModule } from 'src/db/prisma.module';

@Module({
  providers: [UserService],
  imports: [PrismaModule],
  exports: [UserService]
})
export class UserModule {}
