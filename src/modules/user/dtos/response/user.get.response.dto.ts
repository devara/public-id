import { faker } from '@faker-js/faker';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  ENUM_USER_GENDER,
  ENUM_USER_SIGN_UP_FROM,
  ENUM_USER_STATUS,
} from 'src/modules/user/enum/user.enum';
import { DatabaseDto } from 'src/database/dtos/database.dto';

export class UserGetResponseDto extends DatabaseDto {
  @ApiProperty({
    required: true,
    nullable: false,
    maxLength: 100,
    minLength: 1,
  })
  name: string;

  @ApiProperty({
    required: true,
    nullable: false,
    maxLength: 50,
    minLength: 3,
  })
  username: string;

  @ApiProperty({
    required: true,
    nullable: false,
    example: faker.internet.email(),
    maxLength: 100,
  })
  email: string;

  @ApiHideProperty()
  @Exclude()
  password: string;

  @ApiProperty({
    required: true,
    nullable: false,
    example: faker.date.future(),
  })
  passwordExpired: Date;

  @ApiProperty({
    required: true,
    nullable: false,
    example: faker.date.past(),
  })
  passwordCreated: Date;

  @ApiHideProperty()
  @Exclude()
  passwordAttempt: number;

  @ApiProperty({
    required: true,
    nullable: false,
    example: faker.date.recent(),
  })
  signUpDate: Date;

  @ApiProperty({
    required: true,
    nullable: false,
    example: ENUM_USER_SIGN_UP_FROM.ADMIN,
    enum: ENUM_USER_SIGN_UP_FROM,
  })
  signUpFrom: ENUM_USER_SIGN_UP_FROM;

  @ApiHideProperty()
  @Exclude()
  salt: string;

  @ApiProperty({
    required: true,
    nullable: false,
    example: ENUM_USER_STATUS.ACTIVE,
    enum: ENUM_USER_STATUS,
  })
  status: ENUM_USER_STATUS;

  @ApiProperty({
    example: ENUM_USER_GENDER.MALE,
    enum: ENUM_USER_GENDER,
    required: false,
    nullable: true,
  })
  gender?: ENUM_USER_GENDER;

  @ApiProperty({
    example: faker.string.uuid(),
    required: true,
  })
  country: string;
}
