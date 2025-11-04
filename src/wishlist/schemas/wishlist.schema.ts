import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type WishlistDocument = Wishlist & Document;

@Schema({ timestamps: true })
export class Wishlist {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  user_id: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Group' }], default: [] })
  group_ids: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Concert' }], default: [] })
  concert_ids: Types.ObjectId[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);
