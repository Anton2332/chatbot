import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { exclude } from '../common/utils';
import * as bcrypt from 'bcrypt';
import { BaseAuthService } from '@services/base-auth.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly baseAuthService: BaseAuthService) {}

  async login(userDto: CreateUserDto) {
    const user = await this.userService.findOneByEmail(userDto.email);
    if (!user) {
      throw new HttpException('Wrong email or password', HttpStatus.FORBIDDEN);
    }
    const isValidPassword = await bcrypt.compare(userDto.password, user.password)
    if (!isValidPassword) {
      throw new HttpException('Wrong emial or password', HttpStatus.FORBIDDEN);
    }
    const { token: accessToken } = await this.baseAuthService.generateAccessToken({ id: user.id, email: user.email })
    return {...(exclude(user, ['password'])), accessToken };
  }

  async register(userDto: CreateUserDto) {
    const user = await this.userService.findOneByEmail(userDto.email);
    if (user) {
      throw new HttpException('User already exists', HttpStatus.FORBIDDEN);
    }
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const createdUser = await this.userService.create({ ...userDto, password: hashedPassword });

    const { token: accessToken } = await this.baseAuthService.generateAccessToken({ id: createdUser.id, email: createdUser.email })
    return {...(exclude(createdUser, ['password'])), accessToken };
  }
}
