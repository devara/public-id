import { OmitType } from '@nestjs/swagger';
import { PasswordField } from 'src/core/decorators/field.decorator';
import { UserCreateRequestDto } from 'src/modules/user/dtos/request/user.create.request.dto';

export class AuthRegisterRequestDto extends OmitType(UserCreateRequestDto, [
  'gender',
]) {
  @PasswordField({
    maxLength: 50,
  })
  password!: string;
}
