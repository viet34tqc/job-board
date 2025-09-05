import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Role } from 'src/roles/role.schema';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export type UserDocument = HydratedDocument<User>;

// @Schema decorator with timestamps: true automatically adds and manages
// createdAt and updatedAt fields in the document
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: Object })
  company?: {
    _id: Types.ObjectId;
    name: string;
  };

  @Prop()
  address?: string;

  @Prop()
  age?: number;

  @Prop()
  gender?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: Role.name,
  })
  role: Types.ObjectId;

  // For simplicity
  @Prop()
  refreshToken: string;

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
    _id: Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  updatedBy: {
    _id: Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  deletedBy: {
    _id: Types.ObjectId;
    email: string;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
