import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'loc_villages' })
export class Village {
  @Prop()
  id: number;

  @Prop()
  district_id: number;

  @Prop()
  name: string;
}

export type VillageDocument = HydratedDocument<Village>;

export const VillageSchema = SchemaFactory.createForClass(Village);
