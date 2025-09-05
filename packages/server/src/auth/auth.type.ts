import { Request } from 'express';
import { Types } from 'mongoose';
import { UserDocument } from 'src/users/schemas/user.schema';

export type AuthJwtPayload = {
  email: string;
  sub: string;
  name: string;
  role: { _id: Types.ObjectId; name: string };
};

export interface RequestWithUser extends Request {
  user: UserDocument;
}
