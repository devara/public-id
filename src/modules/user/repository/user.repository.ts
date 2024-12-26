import { Injectable } from '@nestjs/common';
import { DatabaseRepository } from 'src/database/base/db.repository';
import { UserDocument, UserEntity } from '../entity/user.entity';
import { InjectDatabaseModel } from 'src/database/decorators/db.decorator';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository extends DatabaseRepository<
  UserEntity,
  UserDocument
> {
  constructor(
    @InjectDatabaseModel(UserEntity.name)
    private readonly model: Model<UserEntity>,
  ) {
    super(model);
  }
}
