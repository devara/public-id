import { registerAs } from '@nestjs/config';
import ms from 'ms';
import { AuthConfig } from './auth.config.type';

export default registerAs<AuthConfig>('auth', () => {
  return {
    jwt: {
      accessToken: {
        secretKey: process.env.AUTH_JWT_ACCESS_TOKEN_SECRET_KEY,
        expirationTime: ms(process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRED) / 1000,
      },

      refreshToken: {
        secretKey: process.env.AUTH_JWT_REFRESH_TOKEN_SECRET_KEY,
        expirationTime: ms(process.env.AUTH_JWT_REFRESH_TOKEN_EXPIRED) / 1000,
      },

      subject: process.env.AUTH_JWT_SUBJECT,
      audience: process.env.AUTH_JWT_AUDIENCE,
      issuer: process.env.AUTH_JWT_ISSUER,
      prefixAuthorization: 'Bearer',
    },
    password: {
      attempt: true,
      maxAttempt: 5,
      saltLength: 8,
      expiredIn: ms('182d') / 1000, // 0.5 years
      expiredInTemporary: ms('3d') / 1000, // 3 days
      period: ms('90d') / 1000, // 3 months
    },
  };
});
