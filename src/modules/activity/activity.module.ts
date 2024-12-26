import { Module } from '@nestjs/common';
import { ActivityRepositoryModule } from './repository/activity.repository.module';
import { ActivityService } from './services/activity.service';

@Module({
  imports: [ActivityRepositoryModule],
  exports: [ActivityService],
  providers: [ActivityService],
})
export class ActivityModule {}
