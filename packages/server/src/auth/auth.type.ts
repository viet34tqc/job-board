import { Request } from 'express';
import { User } from 'src/users/schemas/user.schema';

export type AuthPayload = {
  email: string;
  sub: string;
  name: string;
  role: string;
};

export interface RequestWithUser extends Request {
  user: User;
}
