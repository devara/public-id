import { OmitType } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  EnumField,
  StringField,
  UUIDField,
} from 'src/core/decorators/field.decorator';
import { DatabaseDto } from 'src/database/dtos/database.dto';
import { ENUM_ACTIVITY_TYPE } from '../../enums/activity.enum';

@Exclude()
export class ActivityByUserResponse {
  @Expose()
  @StringField()
  name: string;
}

export class ActivityListResponseDto extends OmitType(DatabaseDto, [
  'deleted',
]) {
  @StringField()
  user: string;

  @StringField()
  description: string;

  @Type(() => ActivityByUserResponse)
  by: ActivityByUserResponse;

  @EnumField(() => ENUM_ACTIVITY_TYPE, {
    example: ENUM_ACTIVITY_TYPE.TASK,
  })
  type: ENUM_ACTIVITY_TYPE;

  @UUIDField({
    maxLength: 200,
  })
  type_id: string;

  @Exclude()
  deleted: boolean;
}
