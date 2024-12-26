import { Schema } from '@nestjs/mongoose';
import { DatabaseEntity } from 'src/database/base/db.entity';
import {
  DatabaseProp,
  DatabaseSchema,
} from 'src/database/decorators/db.decorator';
import { IDatabaseDocument } from 'src/database/interface/db.interface';
import { UserEntity } from 'src/modules/user/entity/user.entity';
import { ENUM_ACTIVITY_TYPE } from '../enums/activity.enum';

@Schema({ collection: 'activities' })
export class ActivityEntity extends DatabaseEntity {
  @DatabaseProp({
    required: true,
    trim: true,
    type: String,
    ref: UserEntity.name,
  })
  user: string;

  @DatabaseProp({
    required: true,
    type: String,
  })
  description: string;

  @DatabaseProp({
    required: true,
    trim: true,
    type: String,
    ref: UserEntity.name,
  })
  by: string;

  @DatabaseProp({
    required: true,
    type: String,
    enum: ENUM_ACTIVITY_TYPE,
  })
  type: ENUM_ACTIVITY_TYPE;

  @DatabaseProp({
    required: true,
    type: String,
  })
  type_id: string;
}

export const ActivitySchema = DatabaseSchema(ActivityEntity);
export type ActivityDocument = IDatabaseDocument<ActivityEntity>;
