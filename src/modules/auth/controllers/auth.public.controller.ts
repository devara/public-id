import {
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/services/user.service';
import { AuthService } from '../services/auth.service';
import { ActivityService } from 'src/modules/activity/services/activity.service';
import { InjectDatabaseConnection } from 'src/database/decorators/db.decorator';
import { ClientSession, Connection } from 'mongoose';
import { AuthRegisterRequestDto } from '../dtos/request/auth.register.request.dto';
import { AuthLoginRequestDto } from '../dtos/request/auth.login.request.dto';
import { ENUM_USER_STATUS } from 'src/modules/user/enums/user.enum';
import { Response } from 'src/core/response/decorators/response.decorator';
import { ENUM_ACTIVITY_TYPE } from 'src/modules/activity/enums/activity.enum';
import { STATUS_CODES } from 'http';
import {
  AuthJwtPayload,
  AuthJwtRefreshProtected,
  AuthJwtToken,
} from '../decorators/auth.jwt.decorator';
import { AuthJwtRefreshPayloadDto } from '../dtos/jwt/auth.jwt.refresh-payload.dto';

@Controller({
  path: '/auth',
})
export class AuthPublicController {
  constructor(
    @InjectDatabaseConnection()
    private readonly databaseConnection: Connection,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly activityService: ActivityService,
  ) {}

  @Response()
  @Post('/register')
  async register(
    @Body()
    { name, email, password: passwordString }: AuthRegisterRequestDto,
  ) {
    const emailExist = await this.userService.existByEmail(email);
    if (emailExist) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: 'Email already taken',
      });
    }

    const password = await this.authService.createPassword(passwordString);

    const session: ClientSession = await this.databaseConnection.startSession();
    session.startTransaction();
    try {
      const user = await this.userService.signUp(
        {
          email,
          name,
          password: passwordString,
        },
        password,
      );

      await this.activityService.createByUser(user, {
        description: 'User sign up',
        type: ENUM_ACTIVITY_TYPE.USER,
        type_id: user._id,
      });

      const token = await this.authService.createToken(user);

      await session.commitTransaction();
      await session.endSession();

      return { data: token };
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();

      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: STATUS_CODES[HttpStatus.INTERNAL_SERVER_ERROR],
        _error: error.message,
      });
    }
  }

  @Post('/login')
  async loginWithPassword(@Body() { email, password }: AuthLoginRequestDto) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Email not found',
      });
    }

    const isPasswordValid = await this.authService.validateUser(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Password not match',
      });
    } else if (user.status !== ENUM_USER_STATUS.ACTIVE) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: 'User Inactive',
      });
    }

    try {
      const token = await this.authService.createToken(user);

      return {
        data: token,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: STATUS_CODES[HttpStatus.INTERNAL_SERVER_ERROR],
        _error: error.message,
      });
    }
  }

  @AuthJwtRefreshProtected()
  @Post('/refresh')
  async refresh(
    @AuthJwtToken() refreshToken: string,
    @AuthJwtPayload<AuthJwtRefreshPayloadDto>()
    { _id }: AuthJwtRefreshPayloadDto,
  ) {
    const user = await this.userService.findOneById(_id);
    const token = await this.authService.refreshToken(user, refreshToken);

    return {
      data: token,
    };
  }
}
