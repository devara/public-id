import { EmailField, PasswordField } from 'src/core/decorators/field.decorator';

export class AuthLoginRequestDto {
  @EmailField()
  email: string;

  @PasswordField()
  password: string;
}
