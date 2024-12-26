import { Controller, Get } from '@nestjs/common';
import { Connection } from 'mongoose';
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
}
