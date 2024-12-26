import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/services/user.service';
import { AuthService } from '../services/auth.service';
import { ActivityService } from 'src/modules/activity/services/activity.service';
import { InjectDatabaseConnection } from 'src/database/decorators/db.decorator';
import { ClientSession, Connection } from 'mongoose';
import { AuthRegisterRequestDto } from '../dtos/request/auth.register.request.dto';
import { AuthLoginRequestDto } from '../dtos/request/auth.login.request.dto';
import { AuthLoginResponseDto } from '../dtos/response/auth.login.response.dto';
import { ENUM_USER_STATUS } from 'src/modules/user/enums/user.enum';
import { ENUM_USER_STATUS_CODE_ERROR } from 'src/modules/user/enums/user.status-code.enum';
import { Response } from 'src/core/response/decorators/response.decorator';
import { ENUM_ACTIVITY_TYPE } from 'src/modules/activity/enums/activity.enum';

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
        statusCode: 5152,
        message: 'email already taken',
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
        message: 'internalServerError',
        _error: error.message,
      });
    }
  }

  @Post('/login')
  async loginWithPassword(
    @Body() { email, password }: AuthLoginRequestDto,
  ): Promise<AuthLoginResponseDto> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Email not found',
      });
    }

    const isPasswordValid = await this.authService.validateUser(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.PASSWORD_NOT_MATCH,
        message: 'Password not match',
      });
    } else if (user.status !== ENUM_USER_STATUS.ACTIVE) {
      throw new ForbiddenException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.INACTIVE_FORBIDDEN,
        message: 'User Inactive',
      });
    }

    try {
      const token = await this.authService.createToken(user);

      return token;
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'internalServerError',
        _error: error.message,
      });
    }
  }
}
