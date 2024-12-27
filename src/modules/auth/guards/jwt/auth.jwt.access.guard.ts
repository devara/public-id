import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthJwtAccessPayloadDto } from '../../dtos/jwt/auth.jwt.access-payload.dto';
import { STATUS_CODES } from 'http';

@Injectable()
export class AuthJwtAccessGuard extends AuthGuard('jwtAccess') {
  handleRequest<T = AuthJwtAccessPayloadDto>(
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
