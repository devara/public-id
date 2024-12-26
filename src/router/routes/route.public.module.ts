import { Module } from '@nestjs/common';
import { ActivityModule } from 'src/modules/activity/activity.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AuthPublicController } from 'src/modules/auth/controllers/auth.public.controller';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [UserModule, AuthModule, ActivityModule],
  controllers: [AuthPublicController],
})
export class RoutesPublicModule {}
