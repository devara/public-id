import { PickType } from '@nestjs/swagger';
import { UserCreateRequestDto } from './user.create.request.dto';

export class UserUpdateProfileRequestDto extends PickType(
  UserCreateRequestDto,
  ['name', 'gender'] as const,
) {}
