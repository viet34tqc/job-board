import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Permission } from 'src/permissions/permission.schema';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true })
export class Role {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  isActive: boolean;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: Permission.name,
  })
  permissions: Array<Types.ObjectId>;

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

export const RoleSchema = SchemaFactory.createForClass(Role);
