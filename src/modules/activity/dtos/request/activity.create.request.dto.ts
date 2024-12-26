import {
  EnumField,
  StringField,
  UUIDField,
} from 'src/core/decorators/field.decorator';
import { ENUM_ACTIVITY_TYPE } from '../../enums/activity.enum';

export class ActivityCreateRequestDto {
  @StringField({
    maxLength: 200,
  })
  description: string;

  @EnumField(() => ENUM_ACTIVITY_TYPE, {
    required: true,
    example: ENUM_ACTIVITY_TYPE.TASK,
  })
  type: ENUM_ACTIVITY_TYPE;

  @UUIDField({
    maxLength: 200,
  })
  type_id: string;
}
