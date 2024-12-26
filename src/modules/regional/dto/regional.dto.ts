import { Exclude, Expose } from 'class-transformer';
import { NumberField, StringField } from 'src/core/decorators/field.decorator';

@Exclude()
export class RegionalDto {
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
