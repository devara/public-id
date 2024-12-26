import { Exclude, Expose } from 'class-transformer';
import { RegionalDto } from './regional.dto';
import { NumberField } from 'src/core/decorators/field.decorator';

@Exclude()
export class DistrictDto extends RegionalDto {
  @Expose()
  @NumberField({
    int: true,
    example: 3404,
    description: 'Regency ID of the district',
  })
  regency_id: number;
}
