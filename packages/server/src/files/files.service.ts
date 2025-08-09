import { Injectable } from '@nestjs/common';
import * as path from 'path';

@Injectable()
export class FilesService {
  // Return a simple descriptor for the stored file
  buildFileResponse(file: Express.Multer.File) {
    return {
      originalName: file.originalname,
      filename: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      path: path.relative(process.cwd(), file.path),
      url: `/uploads/${file.filename}`,
    };
  }

  buildFilesResponse(files: Express.Multer.File[]) {
    return files.map((f) => this.buildFileResponse(f));
  }
}
