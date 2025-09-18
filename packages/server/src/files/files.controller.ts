import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { IsPublic } from 'src/auth/decoratots/auth.decorator';
import { ServeFileDto } from './dtos/serve-file.dto';
import { FilesService } from './files.service';
import { S3Service } from './s3.service';
import { UploadRequest } from './types';

@Controller('files')
export class FilesController {
  constructor(
    private filesService: FilesService,
    private s3Service: S3Service,
  ) {}

  @IsPublic()
  @Post('serve')
  async serveFile(@Body() serveFileDto: ServeFileDto, @Res() res: Response) {
    return this.filesService.serveFile(serveFileDto.filePath, res);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadSingle(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: UploadRequest,
  ) {
    return this.filesService.buildFileResponse(file, req.headers?.folder);
  }

  @Post('uploads')
  @UseInterceptors(FilesInterceptor('files', 10))
  uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: UploadRequest,
  ) {
    return this.filesService.buildFilesResponse(files, req.headers?.folder);
  }

  @Post('upload-url')
  async getUploadUrl(
    @Body() body: { filename: string; mimetype: string; size: number },
  ) {
    return this.s3Service.getUploadUrl(body.filename, body.mimetype, body.size);
  }

  @Post('download-url')
  async getDownloadUrl(@Body() body: { key: string }) {
    return this.s3Service.getDownloadUrl(body.key);
  }
}
