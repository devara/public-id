import { OmitType } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { StringField } from 'src/core/decorators/field.decorator';
import { DatabaseDto } from 'src/database/dtos/database.dto';

@Exclude()
export class TaskByUserResponse {
  @Expose()
  @StringField()
  name: string;
}

export class TaskListResponseDto extends OmitType(DatabaseDto, ['deleted']) {
  @StringField()
  user: string;

  @StringField()
  title: string;

  @StringField()
  description: string;

  @Type(() => TaskByUserResponse)
  by: TaskByUserResponse;

  @Exclude()
  deleted: boolean;
}
