import { EnumField, StringField } from 'src/core/decorators/field.decorator';
import { ENUM_TASK_STATUS } from '../../enums/task.enum';

export class TaskUpdateRequestDto {
  @StringField({
    required: false,
    minLength: 5,
    maxLength: 50,
  })
  title?: string;

  @StringField({
    required: false,
    minLength: 10,
    maxLength: 200,
  })
  description?: string;

  @EnumField(() => ENUM_TASK_STATUS, {
    required: false,
    default: ENUM_TASK_STATUS.ONGOING,
    example: ENUM_TASK_STATUS.ONGOING,
  })
  status?: ENUM_TASK_STATUS;
}
