import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GroupDocument = Group & Document;

export enum MusicGenre {
  ROCK = 'rock',
  POP = 'pop',
  K_POP = 'k-pop',
  JAZZ = 'jazz',
  CLASSIQUE = 'classique',
  ELECTRO = 'electronique',
  HIP_HOP = 'hip-hop',
  METAL = 'metal',
  REGGAE = 'reggae',
  BLUES = 'blues',
  COUNTRY = 'country',
  RNB = 'rnb',
  INDIE = 'indie',
  SLAM = 'slam',
  ZINLI = 'zinli',
  TOBA = 'toba',
  AGBADJA = 'agbadja',
  OTHER = 'autre',
}

@Schema({ timestamps: true })
export class Group {
  @Prop({ required: true, trim: true, minlength: 2, maxlength: 200 })
  name: string;

  @Prop({ type: String, enum: MusicGenre, required: true })
  genre: MusicGenre;

  @Prop({ required: true, maxlength: 2000 })
  picture_url: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
