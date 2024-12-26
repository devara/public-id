import { Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AuthPublicController } from 'src/modules/auth/controllers/auth.public.controller';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  controllers: [AuthPublicController],
  imports: [UserModule, AuthModule],
})
export class RoutesPublicModule {}
