import {
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  Put,
} from '@nestjs/common';
import { ClientSession, Connection } from 'mongoose';
import { InjectDatabaseConnection } from 'src/database/decorators/db.decorator';
import { UserService } from '../service/user.service';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from 'src/modules/auth/decorators/auth.jwt.decorator';
import { AuthJwtAccessPayloadDto } from 'src/modules/auth/dtos/jwt/auth.jwt.access-payload.dto';
import { UserDocument } from '../entity/user.entity';
import { UserParsePipe } from '../pipes/user.parse.pipe';
import { Response } from 'src/core/response/decorators/response.decorator';
import { UserUpdateUsernameRequestDto } from '../dtos/request/user.update-username.dto';
import { ENUM_USER_STATUS_CODE_ERROR } from '../enums/user.status-code.enum';
import { UserUpdateProfileRequestDto } from '../dtos/request/user.update-profile.dto';

@Controller({
  path: '/user',
})
export class UserSharedController {
  constructor(
    @InjectDatabaseConnection()
    private readonly databaseConnection: Connection,
    private readonly userService: UserService,
  ) {}

  @Response()
  @AuthJwtAccessProtected()
  @Get('/profile')
  async profile(
    @AuthJwtPayload<AuthJwtAccessPayloadDto>('_id', UserParsePipe)
    user: UserDocument,
  ) {
    const mapped = await this.userService.mapProfile(user);
    return { data: mapped };
  }

  @AuthJwtAccessProtected()
  @Put('/update/profile')
  async updateProfile(
    @AuthJwtPayload<AuthJwtAccessPayloadDto>('_id', UserParsePipe)
    user: UserDocument,
    @Body()
    { ...body }: UserUpdateProfileRequestDto,
  ) {
    const session: ClientSession = await this.databaseConnection.startSession();
    session.startTransaction();

    try {
      await this.userService.updateProfile(user, { ...body });
      await session.commitTransaction();
      await session.endSession();

      return { message: 'Success update profile' };
    } catch (err) {
      await session.abortTransaction();
      await session.endSession();
      throw new InternalServerErrorException({
        statusCode: 5040,
        _error: err.message,
      });
    }
  }

  @AuthJwtAccessProtected()
  @Put('/update/username')
  async updateUsername(
    @AuthJwtPayload<AuthJwtAccessPayloadDto>('_id', UserParsePipe)
    user: UserDocument,
    @Body()
    { username }: UserUpdateUsernameRequestDto,
  ) {
    if (user.username === username) {
      throw new ForbiddenException({
        message: 'Username can not same with old',
      });
    }
    const isUsernameExists = await this.userService.existByUsername(username);
    if (isUsernameExists) {
      throw new ConflictException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USERNAME_EXIST,
        message: 'Username already taken',
      });
    }

    const session: ClientSession = await this.databaseConnection.startSession();
    session.startTransaction();
    try {
      await this.userService.updateUsername(user, { username });

      await session.commitTransaction();
      await session.endSession();

      return { message: 'Success update username' };
    } catch (err: any) {
      await session.abortTransaction();
      await session.endSession();
      throw new InternalServerErrorException({
        statusCode: 5040,
        _error: err.message,
      });
    }

    return;
  }
}
