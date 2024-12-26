import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from './user.repository';
import { UserEntity, UserSchema } from '../entity/user.entity';
import { DATABASE_CONNECTION_NAME } from 'src/database/constants/database.constant';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: UserEntity.name,
          schema: UserSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class UserRepositoryModule {}
