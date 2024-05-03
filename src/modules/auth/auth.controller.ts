import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() userDto: CreateUserDto) {
    return this.authService.login(userDto);
  }

  @Post('register')
  async register(@Body() userDto: CreateUserDto) {
    return this.authService.register(userDto);
  }

}
