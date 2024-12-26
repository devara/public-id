import { Exclude, Expose } from 'class-transformer';
import { NumberField, StringField } from 'src/decorators/field.decorator';

@Exclude()
export class VillageDto {
  @Expose()
  @NumberField({
    int: true,
    example: 3404072002,
  })
  id: number;

  @Expose()
  @NumberField({
    int: true,
    example: 340407,
    description: 'District ID of the village',
  })
  district_id: number;

  @Expose()
  @StringField({
    example: 'Maguwoharjo',
  })
  name: string;
}
