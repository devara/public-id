import {
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Put,
} from '@nestjs/common';
import { ClientSession, Connection } from 'mongoose';
import { InjectDatabaseConnection } from 'src/database/decorators/db.decorator';
import { UserService } from '../services/user.service';
import { ActivityService } from 'src/modules/activity/services/activity.service';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from 'src/modules/auth/decorators/auth.jwt.decorator';
import { AuthJwtAccessPayloadDto } from 'src/modules/auth/dtos/jwt/auth.jwt.access-payload.dto';
import { UserDocument } from '../entity/user.entity';
import { UserParsePipe } from '../pipes/user.parse.pipe';
import { Response } from 'src/core/response/decorators/response.decorator';
import { UserUpdateUsernameRequestDto } from '../dtos/request/user.update-username.dto';
import { UserUpdateProfileRequestDto } from '../dtos/request/user.update-profile.dto';
import { ENUM_ACTIVITY_TYPE } from 'src/modules/activity/enums/activity.enum';

@Controller({
  path: '/user',
})
export class UserSharedController {
  constructor(
    @InjectDatabaseConnection()
    private readonly databaseConnection: Connection,
    private readonly userService: UserService,
    private readonly activityService: ActivityService,
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
  @Put('/profile')
  async updateProfile(
    @AuthJwtPayload<AuthJwtAccessPayloadDto>('_id', UserParsePipe)
    user: UserDocument,
    @Body()
    { ...body }: UserUpdateProfileRequestDto,
  ) {
    const canUpdate = await this.userService.canUpdateProfile(user);
    if (!canUpdate) {
      throw new ForbiddenException({
        message: 'Only can update profile every 1 minute',
      });
    }

    const session: ClientSession = await this.databaseConnection.startSession();
    session.startTransaction();

    try {
      await this.userService.updateProfile(user, { ...body });
      await this.activityService.createByUser(user, {
        description: 'User update profile',
        type: ENUM_ACTIVITY_TYPE.USER,
        type_id: user._id,
      });

      await session.commitTransaction();
      await session.endSession();

      return { message: 'Success update profile' };
    } catch (err) {
      await session.abortTransaction();
      await session.endSession();
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        _error: err.message,
      });
    }
  }

  @AuthJwtAccessProtected()
  @Put('/username')
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
        statusCode: HttpStatus.CONFLICT,
        message: 'Username already taken',
      });
    }

    const canUpdate = await this.userService.canUpdateUsername(user);
    if (!canUpdate) {
      throw new ForbiddenException({
        message: 'Only can update username every 1 hour',
      });
    }

    const session: ClientSession = await this.databaseConnection.startSession();
    session.startTransaction();
    try {
      await this.userService.updateUsername(user, { username });
      await this.activityService.createByUser(user, {
        description: 'User change username',
        type: ENUM_ACTIVITY_TYPE.USER,
        type_id: user._id,
      });

      await session.commitTransaction();
      await session.endSession();

      return { message: 'Success change username' };
    } catch (err: any) {
      await session.abortTransaction();
      await session.endSession();
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        _error: err.message,
      });
    }

    return;
  }
}
