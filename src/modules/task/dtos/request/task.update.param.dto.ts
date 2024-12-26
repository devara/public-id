import { UUIDField } from 'src/core/decorators/field.decorator';

export class TaskUpdateParamDto {
  @UUIDField()
  uuid: string;
}
