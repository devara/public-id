import { Prop, Schema } from '@nestjs/mongoose';
import { DatabaseSchema } from 'src/database/decorators/db.decorator';
import { IDatabaseDocument } from 'src/database/interface/db.interface';

@Schema({ collection: 'loc_districts' })
export class District {
  @Prop()
  id: number;

  @Prop()
  regency_id: number;

  @Prop()
  name: string;
}

export type DistrictDocument = IDatabaseDocument<District>;

export const DistrictSchema = DatabaseSchema(District);
