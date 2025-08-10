import { Request } from 'express';

export interface UploadRequest extends Request {
  body: {
    folder?: string;
  };
}
