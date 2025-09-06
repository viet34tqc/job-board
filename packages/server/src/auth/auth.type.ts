import { Request } from 'express';
import { Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type AuthJwtPayload = {
  email: string;
  sub: string;
  name: string;
  role: { _id: Types.ObjectId; name: string };
};

// The user object returned after validate method in JwtStrategy
// We are not using UserDocument here because it includes Mongoose internal fields and methods
export type AuthUser = User & {
  permissions: Array<{
    _id: Types.ObjectId;
    name: string;
    apiPath: string;
    method: string;
    module: string;
  }>;
};

export interface RequestWithUser extends Request {
  user: AuthUser;
}
