import { Transform } from 'class-transformer';
import {
  DEFAULT_CURRENT_PAGE,
  DEFAULT_PER_PAGE,
} from 'src/constants/app.constant';
import { NumberField } from 'src/core/decorators/field.decorator';

export class PaginationDto {
  @Transform(({ value }) => parseInt(value))
  @NumberField({
    minimum: 1,
    default: DEFAULT_CURRENT_PAGE,
    int: true,
    required: false,
  })
  readonly page: number = DEFAULT_CURRENT_PAGE;

  @Transform(({ value }) => parseInt(value))
  @NumberField({
    minimum: 5,
    maximum: 25,
    default: DEFAULT_PER_PAGE,
    int: true,
    required: false,
  })
  readonly per_page: number = DEFAULT_PER_PAGE;
}
