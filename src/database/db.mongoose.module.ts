import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseService } from './db.mongoose.service';
import { DATABASE_CONNECTION_NAME } from './constants/database.constant';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      connectionName: DATABASE_CONNECTION_NAME,
      useClass: MongooseService,
    }),
  ],
})
export class DatabaseMongooseModule {}
