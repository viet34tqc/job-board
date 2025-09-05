import { Request } from 'express';
import { UserDocument } from 'src/users/schemas/user.schema';
import { Types } from 'mongoose';

export type AuthJwtPayload = {
  email: string;
  sub: string;
  name: string;
  role: Types.ObjectId;
};

export interface RequestWithUser extends Request {
  user: UserDocument;
}
