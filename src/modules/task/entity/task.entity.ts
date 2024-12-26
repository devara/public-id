import { Schema } from '@nestjs/mongoose';
import { DatabaseEntity } from 'src/database/base/db.entity';
import {
  DatabaseProp,
  DatabaseSchema,
} from 'src/database/decorators/db.decorator';
import { IDatabaseDocument } from 'src/database/interface/db.interface';
import { ENUM_TASK_STATUS } from '../enums/task.enum';
import { UserEntity } from 'src/modules/user/entity/user.entity';

@Schema({ collection: 'tasks' })
export class TaskEntity extends DatabaseEntity {
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
    maxlength: 50,
  })
  title: string;

  @DatabaseProp({
    required: true,
    type: String,
    maxlength: 200,
  })
  description: string;

  @DatabaseProp({
    required: true,
    type: String,
    enum: ENUM_TASK_STATUS,
    default: ENUM_TASK_STATUS.ONGOING,
  })
  status: ENUM_TASK_STATUS;

  @DatabaseProp({
    required: true,
    trim: true,
    type: String,
    ref: UserEntity.name,
  })
  by: string;
}

export const TaskSchema = DatabaseSchema(TaskEntity);
export type TaskDocument = IDatabaseDocument<TaskEntity>;
