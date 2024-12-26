import { Module } from '@nestjs/common';
import { TaskRepositoryModule } from './repository/task.repository.module';
import { TaskService } from './services/task.service';

@Module({
  imports: [TaskRepositoryModule],
  exports: [TaskService],
  providers: [TaskService],
})
export class TaskModule {}
