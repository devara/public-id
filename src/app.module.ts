import { Module } from '@nestjs/common';
import { AllConfigModule } from './config/config.module';
import { ApiModule } from './api/api.module';
import { DatabaseMongooseModule } from './database/db.mongoose.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    AllConfigModule,
    DatabaseMongooseModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 45,
      },
    ]),
    ApiModule,
  ],
})
export class AppModule {}
