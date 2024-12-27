import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthJwtRefreshPayloadDto } from '../../dtos/jwt/auth.jwt.refresh-payload.dto';
import { STATUS_CODES } from 'http';

@Injectable()
export class AuthJwtRefreshGuard extends AuthGuard('jwtRefresh') {
  handleRequest<T = AuthJwtRefreshPayloadDto>(
    err: Error,
    user: T,
    info: Error,
  ): T {
    if (err || !user) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: STATUS_CODES[HttpStatus.UNAUTHORIZED],
        _error: err ? err.message : info.message,
      });
    }

    return user;
  }
}
