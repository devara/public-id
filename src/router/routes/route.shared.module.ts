import { Module } from '@nestjs/common';
import { ActivityModule } from 'src/modules/activity/activity.module';
import { ActivitySharedController } from 'src/modules/activity/controllers/activity.shared.controller';
import { AuthModule } from 'src/modules/auth/auth.module';
import { TaskSharedController } from 'src/modules/task/controllers/task.shared.controller';
import { TaskModule } from 'src/modules/task/task.module';
import { UserSharedController } from 'src/modules/user/controllers/user.shared.controller';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [UserModule, AuthModule, ActivityModule, TaskModule],
  exports: [],
  controllers: [
    UserSharedController,
    ActivitySharedController,
    TaskSharedController,
  ],
})
export class RoutesSharedModule {}
