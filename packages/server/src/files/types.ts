import { Request } from 'express';

export interface UploadRequest extends Request {
  headers: {
    folder?: string;
  };
}
