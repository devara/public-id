import { StringField } from 'src/core/decorators/field.decorator';

export class UserUpdateUsernameRequestDto {
  @StringField({
    minLength: 6,
    maxLength: 30,
  })
  username: string;
}
