import { Exclude, Expose } from 'class-transformer';
import { NumberField, StringField } from 'src/decorators/field.decorator';

@Exclude()
export class DistrictDto {
  @Expose()
  @NumberField({
    int: true,
    example: 340407,
  })
  id: number;

  @Expose()
  @NumberField({
    int: true,
    example: 3404,
    description: 'Regency ID of the district',
  })
  regency_id: number;

  @Expose()
  @StringField({
    example: 'DEPOK',
  })
  name: string;
}
