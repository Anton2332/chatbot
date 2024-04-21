import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { BaseAuthService } from '@services/base-auth.service';
import { JWTAuthGuard } from './guards';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true
    }),
    PassportModule.register({ session: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' }
    })
  ],

  providers: [ConfigModule, ConfigService, JWTAuthGuard, BaseAuthService],
  exports: [JwtModule, ConfigModule, ConfigService, JWTAuthGuard, BaseAuthService]
})
export class CommonModule {}
