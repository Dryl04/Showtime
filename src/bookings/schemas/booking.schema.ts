import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Concert', required: true })
  concert_id: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 100 })
  quantity: number;

  @Prop({ required: true, min: 0, max: 100000000 })
  total_price: number;

  @Prop({ type: String, default: null, maxlength: 10000 })
  qr_code: string | null;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
