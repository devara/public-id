import { Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserSharedController } from 'src/modules/user/controllers/user.shared.controller';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [UserModule, AuthModule],
  exports: [],
  controllers: [UserSharedController],
})
export class RoutesSharedModule {}
