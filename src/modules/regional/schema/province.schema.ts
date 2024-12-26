import { Prop, Schema } from '@nestjs/mongoose';
import { DatabaseSchema } from 'src/database/decorators/db.decorator';
import { IDatabaseDocument } from 'src/database/interface/db.interface';

@Schema({ collection: 'loc_provinces' })
export class Province {
  @Prop()
  id: number;

  @Prop()
  name: string;
}

export type ProvinceDocument = IDatabaseDocument<Province>;
export const ProvinceSchema = DatabaseSchema(Province);
