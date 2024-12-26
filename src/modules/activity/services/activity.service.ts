import { Injectable } from '@nestjs/common';
import { ActivityRepository } from '../repository/activity.repository';
import { ActivityDocument, ActivityEntity } from '../entity/activity.entity';
import { UserDocument } from 'src/modules/user/entity/user.entity';
import { ActivityCreateRequestDto } from '../dtos/request/activity.create.request.dto';
import { HelperDateService } from 'src/core/helper/services/helper.date.service';
import { IDatabaseOptions } from 'src/database/interface/db.interface';
import { PaginatedDto, PaginatedMetaDto } from 'src/common/dto/paginated.dto';
import { plainToInstance } from 'class-transformer';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ActivityListResponseDto } from '../dtos/response/activity.list.response.dto';
import { Document } from 'mongoose';

@Injectable()
export class ActivityService {
  constructor(
    private readonly activityRepository: ActivityRepository,
    private readonly dateService: HelperDateService,
  ) {}

  async createByUser(
    user: UserDocument,
    { description, type, type_id }: ActivityCreateRequestDto,
  ): Promise<ActivityDocument> {
    const createdAt = this.dateService.create();
    const activity: ActivityEntity = new ActivityEntity();
    activity.user = user._id;
    activity.by = user._id;
    activity.description = description;
    activity.type = type;
    activity.type_id = type_id;
    activity.createdAt = createdAt;
    activity.updatedAt = createdAt;

    return this.activityRepository.create<ActivityEntity>(activity);
  }

  async findAllByUser(
    user: string,
    options?: IDatabaseOptions<ActivityDocument>,
  ) {
    return this.activityRepository.findAll<ActivityDocument>({
      find: { user },
      paging: options?.paging,
      join: true,
    });
  }

  async getTotalByUser(user: string): Promise<number> {
    return this.activityRepository.count({ find: { user } });
  }

  async mapList(
    items: ActivityDocument[],
    total: number,
    paging: PaginationDto,
  ) {
    return new PaginatedDto(
      plainToInstance(
        ActivityListResponseDto,
        items.map((item: ActivityDocument) =>
          item instanceof Document ? item.toObject() : item,
        ),
      ),
      new PaginatedMetaDto(total, paging),
    );
  }
}
