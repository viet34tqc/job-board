import { Injectable } from '@nestjs/common';
import * as path from 'path';

@Injectable()
export class FilesService {
  // Return a simple descriptor for the stored file
  buildFileResponse(file: Express.Multer.File, folder?: string) {
    const filePath = folder ? path.join(folder, file.filename) : file.filename;

    return {
      originalName: file.originalname,
      filename: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      path: path.relative(process.cwd(), file.path),
      url: `/uploads/${filePath}`,
    };
  }
  buildFilesResponse(files: Express.Multer.File[], folder?: string) {
    return files.map((f) => this.buildFileResponse(f, folder));
  }
}
