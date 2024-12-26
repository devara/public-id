import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'loc_districts' })
export class District {
  @Prop()
  id: number;

  @Prop()
  regency_id: number;

  @Prop()
  name: string;
}

export type DistrictDocument = HydratedDocument<District>;

export const DistrictSchema = SchemaFactory.createForClass(District);
