import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthJwtRefreshPayloadDto } from 'src/modules/auth/dtos/jwt/auth.jwt.refresh-payload.dto';
import { AvailableConfigType } from 'src/config/config.type';

@Injectable()
export class AuthJwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwtRefresh',
) {
  constructor(
    private readonly configService: ConfigService<AvailableConfigType>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme(
        configService.get('auth.jwt.prefixAuthorization', {
          infer: true,
        }),
      ),
      ignoreExpiration: false,
      jsonWebTokenOptions: {
        ignoreNotBefore: false,
        audience: configService.get('auth.jwt.audience', {
          infer: true,
        }),
        issuer: configService.get('auth.jwt.issuer', {
          infer: true,
        }),
      },
      secretOrKey: configService.get('auth.jwt.accessToken.secretKey', {
        infer: true,
      }),
    });
  }

  async validate(
    data: AuthJwtRefreshPayloadDto,
  ): Promise<AuthJwtRefreshPayloadDto> {
    return data;
  }
}
