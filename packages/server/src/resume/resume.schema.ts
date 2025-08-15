import { ResumeStatus } from '@base/shared';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ResumeDocument = HydratedDocument<Resume>;

@Schema({ timestamps: true })
export class Resume {
  @Prop()
  email: string;

  @Prop()
  userId: mongoose.Schema.Types.ObjectId;

  @Prop()
  companyId: mongoose.Schema.Types.ObjectId;

  @Prop()
  jobId: mongoose.Schema.Types.ObjectId;

  @Prop()
  url: string;

  // Only approved resume can be used to apply for a job and company can see it
  @Prop()
  status: ResumeStatus;

  @Prop()
  history: Array<{
    updatedAt: Date;
    status: ResumeStatus;
    updatedBy: { _id: mongoose.Schema.Types.ObjectId; email: string };
  }>;

  @Prop()
  address?: string;

  @Prop()
  logo?: string;

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

export const ResumeSchema = SchemaFactory.createForClass(Resume);
