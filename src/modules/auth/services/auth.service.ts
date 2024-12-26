import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AvailableConfigType } from 'src/config/config.type';
import { HelperDateService } from 'src/core/helper/services/helper.date.service';
import { HelperEncryptionService } from 'src/core/helper/services/helper.encryption.service';
import { HelperHashService } from 'src/core/helper/services/helper.hash.service';
import { HelperStringService } from 'src/core/helper/services/helper.string.service';
import {
  IAuthPassword,
  IAuthPasswordOptions,
} from '../interfaces/auth.interface';
import { Duration } from 'luxon';
import { AuthLoginResponseDto } from '../dtos/response/auth.login.response.dto';
import { AuthJwtAccessPayloadDto } from '../dtos/jwt/auth.jwt.access-payload.dto';
import { plainToInstance } from 'class-transformer';
import { ENUM_AUTH_LOGIN_FROM } from '../enums/auth.enum';
import { AuthJwtRefreshPayloadDto } from '../dtos/jwt/auth.jwt.refresh-payload.dto';
import { UserDocument } from 'src/modules/user/entity/user.entity';

@Injectable()
export class AuthService {
  private readonly jwtAccessTokenSecretKey: string;
  private readonly jwtAccessTokenExpirationTime: number;

  private readonly jwtRefreshTokenSecretKey: string;
  private readonly jwtRefreshTokenExpirationTime: number;

  private readonly jwtPrefixAuthorization: string;
  private readonly jwtAudience: string;
  private readonly jwtIssuer: string;

  // password
  private readonly passwordExpiredIn: number;
  private readonly passwordExpiredTemporary: number;
  private readonly passwordSaltLength: number;

  private readonly passwordAttempt: boolean;
  private readonly passwordMaxAttempt: number;

  constructor(
    private readonly configService: ConfigService<AvailableConfigType>,
    private readonly hashService: HelperHashService,
    private readonly encryptionService: HelperEncryptionService,
    private readonly stringService: HelperStringService,
    private readonly dateService: HelperDateService,
  ) {
    this.jwtAccessTokenSecretKey = this.configService.get(
      'auth.jwt.accessToken.secretKey',
      { infer: true },
    );
    this.jwtAccessTokenExpirationTime = this.configService.get(
      'auth.jwt.accessToken.expirationTime',
      { infer: true },
    );

    this.jwtRefreshTokenSecretKey = this.configService.get(
      'auth.jwt.refreshToken.secretKey',
      { infer: true },
    );
    this.jwtRefreshTokenExpirationTime = this.configService.get(
      'auth.jwt.refreshToken.expirationTime',
      { infer: true },
    );

    this.jwtPrefixAuthorization = this.configService.get(
      'auth.jwt.prefixAuthorization',
      { infer: true },
    );
    this.jwtAudience = this.configService.get('auth.jwt.audience', {
      infer: true,
    });
    this.jwtIssuer = this.configService.get('auth.jwt.issuer', {
      infer: true,
    });

    // password
    this.passwordExpiredIn = this.configService.get('auth.password.expiredIn', {
      infer: true,
    });
    this.passwordExpiredTemporary = this.configService.get(
      'auth.password.expiredInTemporary',
      { infer: true },
    );
    this.passwordSaltLength = this.configService.get(
      'auth.password.saltLength',
      { infer: true },
    );
  }

  async createAccessToken(
    subject: string,
    payload: AuthJwtAccessPayloadDto,
  ): Promise<string> {
    return this.encryptionService.jwtEncrypt(
      { ...payload },
      {
        subject,
        secretKey: this.jwtAccessTokenSecretKey,
        expiredIn: this.jwtAccessTokenExpirationTime,
        audience: this.jwtAudience,
        issuer: this.jwtIssuer,
      },
    );
  }

  async validateAccessToken(subject: string, token: string): Promise<boolean> {
    return this.encryptionService.jwtVerify(token, {
      secretKey: this.jwtAccessTokenSecretKey,
      audience: this.jwtAudience,
      issuer: this.jwtIssuer,
      subject,
    });
  }

  async payloadAccessToken(token: string) {
    return this.encryptionService.jwtDecrypt(token);
  }

  async createRefreshToken(
    subject: string,
    payload: AuthJwtRefreshPayloadDto,
  ): Promise<string> {
    return this.encryptionService.jwtEncrypt(
      { ...payload },
      {
        secretKey: this.jwtRefreshTokenSecretKey,
        expiredIn: this.jwtRefreshTokenExpirationTime,
        audience: this.jwtAudience,
        issuer: this.jwtIssuer,
        subject,
      },
    );
  }

  async validateRefreshToken(subject: string, token: string): Promise<boolean> {
    return this.encryptionService.jwtVerify(token, {
      secretKey: this.jwtRefreshTokenSecretKey,
      audience: this.jwtAudience,
      issuer: this.jwtIssuer,
      subject,
    });
  }

  async payloadRefreshToken(token: string) {
    return this.encryptionService.jwtDecrypt(token);
  }

  async validateUser(
    passwordString: string,
    passwordHash: string,
  ): Promise<boolean> {
    return this.hashService.bcryptCompare(passwordString, passwordHash);
  }

  async createPayloadAccessToken(
    data: UserDocument,
    loginDate: Date,
    loginFrom: ENUM_AUTH_LOGIN_FROM,
  ): Promise<AuthJwtAccessPayloadDto> {
    return plainToInstance(AuthJwtAccessPayloadDto, {
      _id: data._id,
      email: data.email,
      loginDate,
      loginFrom,
    });
  }

  async createPayloadRefreshToken({
    _id,
    loginFrom,
    loginDate,
  }: AuthJwtAccessPayloadDto): Promise<AuthJwtRefreshPayloadDto> {
    return {
      _id,
      loginFrom,
      loginDate,
    };
  }

  async createSalt(length: number): Promise<string> {
    return this.hashService.randomSalt(length);
  }

  async createPassword(
    password: string,
    options?: IAuthPasswordOptions,
  ): Promise<IAuthPassword> {
    const salt: string = await this.createSalt(this.passwordSaltLength);
    const today = this.dateService.create();
    const passwordExpired: Date = this.dateService.forward(
      today,
      Duration.fromObject({
        seconds: options?.temporary
          ? this.passwordExpiredTemporary
          : this.passwordExpiredIn,
      }),
    );
    const passwordCreated: Date = this.dateService.create();
    const passwordHash = this.hashService.bcrypt(password, salt);
    return {
      passwordHash,
      passwordExpired,
      passwordCreated,
      salt,
    };
  }

  async createPasswordRandom(): Promise<string> {
    return this.stringService.random(10);
  }

  async checkPasswordExpired(passwordExpired: Date): Promise<boolean> {
    const today: Date = this.dateService.create();
    const passwordExpiredConvert: Date =
      this.dateService.create(passwordExpired);

    return today > passwordExpiredConvert;
  }

  async createToken(user: UserDocument): Promise<AuthLoginResponseDto> {
    const loginDate = this.dateService.create();

    const payloadAccessToken = await this.createPayloadAccessToken(
      user,
      loginDate,
      ENUM_AUTH_LOGIN_FROM.CREDENTIAL,
    );
    const accessToken: string = await this.createAccessToken(
      user.email,
      payloadAccessToken,
    );

    const payloadRefreshToken: AuthJwtRefreshPayloadDto =
      await this.createPayloadRefreshToken(payloadAccessToken);
    const refreshToken: string = await this.createRefreshToken(
      user.email,
      payloadRefreshToken,
    );

    return {
      tokenType: this.jwtPrefixAuthorization,
      expiresIn: this.jwtAccessTokenExpirationTime,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(
    user: UserDocument,
    refreshTokenFromRequest: string,
  ): Promise<AuthLoginResponseDto> {
    const payloadRefreshToken =
      this.encryptionService.jwtDecrypt<AuthJwtRefreshPayloadDto>(
        refreshTokenFromRequest,
      );
    const payloadAccessToken: AuthJwtAccessPayloadDto =
      await this.createPayloadAccessToken(
        user,
        payloadRefreshToken.loginDate,
        payloadRefreshToken.loginFrom,
      );
    const accessToken: string = await this.createAccessToken(
      user.email,
      payloadAccessToken,
    );

    return {
      tokenType: this.jwtPrefixAuthorization,
      expiresIn: this.jwtAccessTokenExpirationTime,
      accessToken,
      refreshToken: refreshTokenFromRequest,
    };
  }
}
