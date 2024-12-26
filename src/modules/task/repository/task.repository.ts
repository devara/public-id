import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseRepository } from 'src/database/base/db.repository';
import { TaskDocument, TaskEntity } from '../entity/task.entity';
import { InjectDatabaseModel } from 'src/database/decorators/db.decorator';
import { UserEntity } from 'src/modules/user/entity/user.entity';

@Injectable()
export class TaskRepository extends DatabaseRepository<
  TaskEntity,
  TaskDocument
> {
  constructor(
    @InjectDatabaseModel(TaskEntity.name)
    private readonly taskModel: Model<TaskEntity>,
  ) {
    super(taskModel, {
      path: 'by',
      localField: 'by',
      foreignField: '_id',
      model: UserEntity.name,
      justOne: true,
    });
  }
}
