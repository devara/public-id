import {
  EmailField,
  PasswordField,
  StringField,
} from 'src/core/decorators/field.decorator';

export class AuthRegisterRequestDto {
  @StringField()
  name!: string;

  @EmailField()
  email!: string;

  @PasswordField()
  password!: string;
}
