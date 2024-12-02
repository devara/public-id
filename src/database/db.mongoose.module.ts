import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseService } from './db.mongoose.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongooseService,
    }),
  ],
})
export class DatabaseMongooseModule {}
