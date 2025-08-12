import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import * as path from 'path';

@Injectable()
export class FilesService {
  // Return a simple descriptor for the stored file
  buildFileResponse(file: Express.Multer.File, folder?: string) {
    if (!file) throw new BadRequestException('File is required');
    const filePath = folder ? path.join(folder, file.filename) : file.filename;

    return {
      originalName: file.originalname,
      filename: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      path: path.relative(process.cwd(), file.path),
      url: filePath,
    };
  }

  buildFilesResponse(files: Express.Multer.File[], folder?: string) {
    if (!files || files.length === 0)
      throw new BadRequestException('Files is required');
    return files.map((f) => this.buildFileResponse(f, folder));
  }

  async serveFile(filePath: string, res: Response): Promise<void> {
    // Normalize the path to prevent directory traversal attacks
    const normalizedPath = path.normalize(filePath);

    // Ensure the path doesn't contain directory traversal attempts
    if (normalizedPath.includes('..') || path.isAbsolute(normalizedPath)) {
      throw new BadRequestException('Invalid file path');
    }

    const fullFilePath = path.join(process.cwd(), 'uploads', normalizedPath);

    try {
      const fileStat = await stat(fullFilePath);
      if (!fileStat.isFile()) {
        throw new NotFoundException('File not found');
      }
    } catch {
      throw new NotFoundException('File not found');
    }

    // Stream the file
    const fileStream = createReadStream(fullFilePath);
    fileStream.pipe(res);

    // Handle stream errors
    fileStream.on('error', () => {
      throw new NotFoundException('Error reading file');
    });
  }
}
