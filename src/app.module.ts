import { Module } from '@nestjs/common';
import { AllConfigModule } from './config/config.module';
import { ApiModule } from './api/api.module';
import { DatabaseMongooseModule } from './database/db.mongoose.module';

@Module({
  imports: [AllConfigModule, DatabaseMongooseModule, ApiModule],
})
export class AppModule {}
