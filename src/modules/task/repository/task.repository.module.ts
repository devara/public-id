import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskEntity, TaskSchema } from '../entity/task.entity';
import { DATABASE_CONNECTION_NAME } from 'src/database/constants/database.constant';
import { TaskRepository } from './task.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: TaskEntity.name,
          schema: TaskSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
  providers: [TaskRepository],
  exports: [TaskRepository],
})
export class TaskRepositoryModule {}
