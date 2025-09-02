import { Request } from 'express';
import mongoose from 'mongoose';
import { UserDocument } from 'src/users/schemas/user.schema';

export type AuthJwtPayload = {
  email: string;
  sub: string;
  name: string;
  role: mongoose.Schema.Types.ObjectId;
};

export interface RequestWithUser extends Request {
  user: UserDocument;
}
