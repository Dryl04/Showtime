import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type ConcertDocument = Concert & Document;

@Schema({ timestamps: true })
export class Concert {
  _id: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user_id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, trim: true, minlength: 2, maxlength: 200 })
  name_group: string;

  @Prop({ required: true, trim: true, minlength: 2, maxlength: 200 })
  name_concert: string;

  @Prop({ required: true, trim: true, maxlength: 100 })
  genre: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, trim: true, minlength: 2, maxlength: 300 })
  place: string;

  @Prop({ type: String, default: null, maxlength: 2000 })
  picture_url: string;

  @Prop({ type: Number, min: 0, max: 10000000, default: 0 })
  price: number;

  @Prop({ type: Number, min: 0, max: 100000, default: 0 })
  number_of_ticket: number;

  @Prop({ type: Number, min: 0, max: 100000, default: 0 })
  ticket_left: number;

  @Prop({ type: Number, min: 0, max: 100000, default: 0 })
  ticket_sold: number;
}

export const ConcertSchema = SchemaFactory.createForClass(Concert);
