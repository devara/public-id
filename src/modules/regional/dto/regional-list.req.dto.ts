import { PaginationDto } from 'src/common/dto/pagination.dto';
import { StringField } from 'src/core/decorators/field.decorator';

export class RegionalListReqDto extends PaginationDto {}

export class RegionalListSearchReqDto extends PaginationDto {
  @StringField({
    required: true,
    minLength: 3,
  })
  search: string;
}
