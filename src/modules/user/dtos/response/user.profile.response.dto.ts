import { ApiProperty, getSchemaPath, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UserGetResponseDto } from 'src/modules/user/dtos/response/user.get.response.dto';

export class UserProfileResponseDto extends OmitType(UserGetResponseDto, [
  'country',
] as const) {}
