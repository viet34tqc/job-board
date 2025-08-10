import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import * as path from 'path';
import { IsPublic } from 'src/auth/decoratots/auth.decorator';
import { FilesService } from './files.service';
import { UploadRequest } from './types';

@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @IsPublic()
  @Get('uploads/:filename')
  async serveFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(process.cwd(), 'uploads', filename);

    // Check if file exists
    try {
      await stat(filePath);
    } catch {
      throw new NotFoundException('File not found');
    }

    // Set appropriate headers
    res.setHeader('Content-Type', 'application/octet-stream');

    // Stream the file
    const fileStream = createReadStream(filePath);
    fileStream.pipe(res);

    // Handle stream errors
    fileStream.on('error', () => {
      throw new NotFoundException('Error reading file');
    });
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadSingle(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: UploadRequest,
  ) {
    return this.filesService.buildFileResponse(file, req.body?.folder);
  }

  @Post('uploads')
  @UseInterceptors(FilesInterceptor('files', 10))
  uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: UploadRequest,
  ) {
    return this.filesService.buildFilesResponse(files, req.body?.folder);
  }
}
