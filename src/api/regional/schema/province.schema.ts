import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'loc_provinces' })
export class Province {
  @Prop()
  id: number;

  @Prop()
  name: string;
}

export type ProvinceDocument = HydratedDocument<Province>;

export const ProvinceSchema = SchemaFactory.createForClass(Province);
