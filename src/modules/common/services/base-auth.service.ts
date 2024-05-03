import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenDTO } from '../dtos';
import { IJWTPayload } from '../types';

@Injectable()
export class BaseAuthService {
  constructor(private jwtService: JwtService) {}

  async generateAccessToken(payload: IJWTPayload): Promise<TokenDTO | null> {
    try {
      const accessToken = this.jwtService.sign(payload, {
        privateKey: process.env.JWT_SECRET,
        expiresIn: '2d'
      });

      return { token: accessToken };
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async generateRefreshToken(payload: IJWTPayload): Promise<TokenDTO | null> {
    try {
      const refreshToken = this.jwtService.sign(payload, {
        privateKey: process.env.JWT_SECRET,
        expiresIn: '15d'
      });

      return { token: refreshToken };
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async generateTokens(payload: IJWTPayload) {
    const { token: accessToken } = await this.generateAccessToken(payload);
    const { token: refreshToken } = await this.generateRefreshToken(payload);
    return { accessToken, refreshToken };
  }

  verifyToken<T extends object>(token) {
    try {
      return this.jwtService.verify<T>(token, {
        secret: process.env.JWT_SECRET
      });
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async decodeToken(token: string) {
    try {
      return this.jwtService.decode(token);
    } catch (e) {
      throw new Error(e.message);
    }
  }
}
