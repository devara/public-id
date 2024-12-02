import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'loc_regencies' })
export class Regency {
  @Prop()
  id: number;

  @Prop()
  province_id: number;

  @Prop()
  name: string;
}

export type RegencyDocument = HydratedDocument<Regency>;

export const RegencySchema = SchemaFactory.createForClass(Regency);
