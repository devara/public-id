import { Exclude, Expose } from 'class-transformer';
import { RegionalDto } from './regional.dto';
import { NumberField } from 'src/core/decorators/field.decorator';

@Exclude()
export class RegencyDto extends RegionalDto {
  @Expose()
  @NumberField({
    int: true,
    example: 34,
    description: 'Province ID of the regency',
  })
  province_id: number;
}
