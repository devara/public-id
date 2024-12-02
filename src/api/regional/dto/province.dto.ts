import { Exclude, Expose } from 'class-transformer';
import { NumberField, StringField } from 'src/decorators/field.decorator';

@Exclude()
export class ProvinceDto {
  @Expose()
  @NumberField({
    int: true,
    example: 34,
  })
  id: number;

  @Expose()
  @StringField({
    example: 'DAERAH ISTIMEWA YOGYAKARTA',
  })
  name: string;
}
