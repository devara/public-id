import { Prop, Schema } from '@nestjs/mongoose';
import { DatabaseSchema } from 'src/database/decorators/db.decorator';
import { IDatabaseDocument } from 'src/database/interface/db.interface';

@Schema({ collection: 'loc_villages' })
export class Village {
  @Prop()
  id: number;

  @Prop()
  district_id: number;

  @Prop()
  name: string;
}

export type VillageDocument = IDatabaseDocument<Village>;

export const VillageSchema = DatabaseSchema(Village);
