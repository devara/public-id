import {
  EmailField,
  EnumField,
  StringField,
} from 'src/core/decorators/field.decorator';
import { ENUM_USER_GENDER } from 'src/modules/user/enums/user.enum';

export class UserCreateRequestDto {
  @EmailField({
    required: true,
    maxLength: 100,
  })
  email: string;

  @StringField({
    minLength: 2,
    maxLength: 100,
  })
  name: string;

  @EnumField(() => ENUM_USER_GENDER, { example: ENUM_USER_GENDER.MALE })
  gender: ENUM_USER_GENDER;
}
