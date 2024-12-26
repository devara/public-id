import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseRepository } from 'src/database/base/db.repository';
import { ActivityDocument, ActivityEntity } from '../entity/activity.entity';
import { InjectDatabaseModel } from 'src/database/decorators/db.decorator';
import { UserEntity } from 'src/modules/user/entity/user.entity';

@Injectable()
export class ActivityRepository extends DatabaseRepository<
  ActivityEntity,
  ActivityDocument
> {
  constructor(
    @InjectDatabaseModel(ActivityEntity.name)
    private readonly activityModel: Model<ActivityEntity>,
  ) {
    super(activityModel, {
      path: 'by',
      localField: 'by',
      foreignField: '_id',
      model: UserEntity.name,
      justOne: true,
    });
  }
}
