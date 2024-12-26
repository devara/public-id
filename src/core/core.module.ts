import { Module } from '@nestjs/common';
import { AllConfigModule } from 'src/config/config.module';
import { DatabaseMongooseModule } from 'src/database/db.mongoose.module';
import { HelperModule } from './helper/helper.module';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [
    AllConfigModule,
    DatabaseMongooseModule,
    HelperModule.forRoot(),
    AuthModule.forRoot(),
  ],
})
export class CoreModule {}
