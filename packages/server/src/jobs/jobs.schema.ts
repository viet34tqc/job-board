import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type JobDocument = HydratedDocument<Job>;

// @Schema decorator with timestamps: true automatically adds and manages
// createdAt and updatedAt fields in the document
@Schema({ timestamps: true })
export class Job {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  skills: string[];

  @Prop({ type: Object })
  company: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    logo?: string;
  };

  @Prop()
  location: string;

  @Prop()
  salary?: number;

  @Prop()
  quantity?: number;

  @Prop()
  level?: string;

  @Prop()
  description: string;

  @Prop()
  isActive: boolean;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deletedAt?: Date;

  @Prop()
  isDeleted: boolean;

  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
}

export const JobSchema = SchemaFactory.createForClass(Job);
