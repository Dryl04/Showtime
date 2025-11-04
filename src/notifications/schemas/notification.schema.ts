import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum NotificationType {
  CONCERT_REMINDER = 'concert_reminder',
  ARTIST_EVENT = 'artist_event',
  WISHLIST_EVENT = 'wishlist_event',
  NEW_CONCERT_FROM_FAVORITE_GROUP = 'new_concert_from_favorite_group',
  CONCERT_PRICE_CHANGE = 'concert_price_change',
  CONCERT_DATE_CHANGE = 'concert_date_change',
}

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({
    type: String,
    enum: NotificationType,
    default: NotificationType.CONCERT_REMINDER
  })
  type: NotificationType;

  @Prop({ required: true })
  titre: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: false })
  is_read: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Concert' })
  concert_id?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Group' })
  group_id?: Types.ObjectId;

  @Prop({ type: String })
  action_url?: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

// Index pour améliorer les performances
NotificationSchema.index({ user_id: 1, createdAt: -1 });
NotificationSchema.index({ user_id: 1, is_read: 1 });
