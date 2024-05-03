import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TrimMiddleware } from './modules/common/middlewares/trim.middleware';
import { CommonModule } from './modules/common/common.module';
import { PrismaModule } from './db/prisma.module';
import { MessageModule } from './modules/message/message.module';
import { UserModule } from './modules/user/user.module';
import { PresetModule } from './modules/preset/preset.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    CommonModule,
    PrismaModule,
    MessageModule,
    UserModule,
    PresetModule,
    AuthModule
  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(...[TrimMiddleware]).forRoutes('/');
  }
}
