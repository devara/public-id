import { OmitType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UserGetResponseDto } from 'src/modules/user/dtos/response/user.get.response.dto';

export class UserProfileResponseDto extends OmitType(UserGetResponseDto, [
  'deleted',
] as const) {
  @Exclude()
  deleted: boolean;
}
