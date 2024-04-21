import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BaseAuthService } from '@services/base-auth.service';

/**
 * @param  {JWTAuthGuard} This guard checks user token and verify him
 */

@Injectable()
export class JWTAuthGuard implements CanActivate {
  constructor(private readonly baseAuthService: BaseAuthService) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const accessToken = request?.headers?.authorization ?? null;
    if (!accessToken) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    try {
      const [, token] = accessToken.split(' ');
      const user = this.baseAuthService.verifyToken<any>(token);

      if (!user) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      request.user = user;
    } catch (e) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return true;
  }
}
