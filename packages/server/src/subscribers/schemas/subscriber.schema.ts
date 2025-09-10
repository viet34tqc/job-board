import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SubscriberDocument = HydratedDocument<Subscriber>;

// @Schema decorator with timestamps: true automatically adds and manages
// createdAt and updatedAt fields in the document
@Schema({ timestamps: true })
export class Subscriber {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  name: string;

  @Prop({ required: true })
  skills: string[];
}

export const SubscriberSchema = SchemaFactory.createForClass(Subscriber);
