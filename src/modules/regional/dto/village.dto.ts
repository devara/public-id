import { Exclude, Expose } from 'class-transformer';
import { RegionalDto } from './regional.dto';
import { NumberField } from 'src/core/decorators/field.decorator';

@Exclude()
export class VillageDto extends RegionalDto {
  @Expose()
  @NumberField({
    int: true,
    example: 340407,
    description: 'District ID of the village',
  })
  district_id: number;
}
