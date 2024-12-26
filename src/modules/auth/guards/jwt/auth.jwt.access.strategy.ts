import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AvailableConfigType } from 'src/config/config.type';
import { AuthJwtAccessPayloadDto } from '../../dtos/jwt/auth.jwt.access-payload.dto';

@Injectable()
export class AuthJwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwtAccess',
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
        ignoreNotBefore: true,
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
    data: AuthJwtAccessPayloadDto,
  ): Promise<AuthJwtAccessPayloadDto> {
    return data;
  }
}
