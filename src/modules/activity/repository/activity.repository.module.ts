import { Module } from '@nestjs/common';
import { ActivityRepository } from './activity.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivityEntity, ActivitySchema } from '../entity/activity.entity';
import { DATABASE_CONNECTION_NAME } from 'src/database/constants/database.constant';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: ActivityEntity.name,
          schema: ActivitySchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
  providers: [ActivityRepository],
  exports: [ActivityRepository],
})
export class ActivityRepositoryModule {}
