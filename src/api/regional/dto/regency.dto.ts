import { Exclude, Expose } from 'class-transformer';
import { NumberField, StringField } from 'src/decorators/field.decorator';

@Exclude()
export class RegencyDto {
  @Expose()
  @NumberField({
    int: true,
    example: 3404,
  })
  id: number;

  @Expose()
  @NumberField({
    int: true,
    example: 34,
    description: 'Province ID of the regency',
  })
  province_id: number;

  @Expose()
  @StringField({
    example: 'KAB. SLEMAN',
  })
  name: string;
}
