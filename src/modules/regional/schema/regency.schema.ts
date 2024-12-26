import { Prop, Schema } from '@nestjs/mongoose';
import { DatabaseSchema } from 'src/database/decorators/db.decorator';
import { IDatabaseDocument } from 'src/database/interface/db.interface';

@Schema({ collection: 'loc_regencies' })
export class Regency {
  @Prop()
  id: number;

  @Prop()
  province_id: number;

  @Prop()
  name: string;
}

export type RegencyDocument = IDatabaseDocument<Regency>;

export const RegencySchema = DatabaseSchema(Regency);
