import { Schema } from '@nestjs/mongoose';
import { DatabaseEntity } from 'src/database/base/db.entity';
import {
  DatabaseProp,
  DatabaseSchema,
} from 'src/database/decorators/db.decorator';
import {
  ENUM_USER_GENDER,
  ENUM_USER_SIGN_UP_FROM,
  ENUM_USER_STATUS,
} from '../enum/user.enum';
import { IDatabaseDocument } from 'src/database/interface/db.interface';

@Schema({ collection: 'users' })
export class UserEntity extends DatabaseEntity {
  @DatabaseProp({
    required: true,
    trim: true,
    maxlength: 100,
    type: String,
  })
  name: string;

  @DatabaseProp({
    required: true,
    unique: true,
    trim: true,
    type: String,
    maxlength: 100,
  })
  email: string;

  @DatabaseProp({
    required: true,
    type: String,
    trim: true,
  })
  password: string;

  @DatabaseProp({
    required: true,
    type: Date,
  })
  passwordCreated: Date;

  @DatabaseProp({
    required: true,
    type: Date,
  })
  passwordExpired: Date;

  @DatabaseProp({
    required: true,
    default: ENUM_USER_STATUS.ACTIVE,
    index: true,
    type: String,
    enum: ENUM_USER_STATUS,
  })
  status: ENUM_USER_STATUS;

  @DatabaseProp({
    required: true,
    type: Date,
    trim: true,
  })
  signUpDate: Date;

  @DatabaseProp({
    required: true,
    type: String,
    enum: ENUM_USER_SIGN_UP_FROM,
  })
  signUpFrom: ENUM_USER_SIGN_UP_FROM;

  @DatabaseProp({
    required: true,
    type: String,
  })
  salt: string;

  @DatabaseProp({
    required: false,
    type: String,
    enum: ENUM_USER_GENDER,
  })
  gender?: ENUM_USER_GENDER;

  @DatabaseProp({
    required: false,
    maxlength: 200,
    trim: true,
  })
  address?: string;
}

export const UserSchema = DatabaseSchema(UserEntity);
export type UserDocument = IDatabaseDocument<UserEntity>;
