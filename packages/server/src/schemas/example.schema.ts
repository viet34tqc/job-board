import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Example extends Document {
  @Prop({ required: true })
  createdAt: Date;
}

export const ExampleSchema = SchemaFactory.createForClass(Example);
