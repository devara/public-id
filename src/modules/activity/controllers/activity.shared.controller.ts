import { Controller, Get, Query } from '@nestjs/common';
import { ActivityService } from '../services/activity.service';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from 'src/modules/auth/decorators/auth.jwt.decorator';
import { UserParsePipe } from 'src/modules/user/pipes/user.parse.pipe';
import { UserDocument } from 'src/modules/user/entity/user.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller({
  path: '/activity',
})
export class ActivitySharedController {
  constructor(private readonly activityService: ActivityService) {}

  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @AuthJwtPayload('_id', UserParsePipe)
    user: UserDocument,
    @Query()
    { page, per_page }: PaginationDto,
  ) {
    const activities = await this.activityService.findAllByUser(user._id, {
      paging: {
        limit: per_page,
        offset: per_page * (page - 1),
      },
    });
    const total = await this.activityService.getTotalByUser(user._id);

    return await this.activityService.mapList(activities, total, {
      page,
      per_page,
    });
  }
}
