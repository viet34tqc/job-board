import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import * as path from 'path';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { UploadRequest } from './types';

const uploadDir = path.join(process.cwd(), 'uploads');

function ensureUploadDir(uploadPath: string) {
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
}

@Module({
  imports: [
    MulterModule.register({
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (req, file, cb) => {
        const allowed =
          /^(image\/.*|application\/pdf|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document)$/i.test(
            file.mimetype,
          );
        if (!allowed) return cb(new Error('Unsupported file type'), false);
        cb(null, true);
      },
      storage: diskStorage({
        destination: (req: UploadRequest, file, cb) => {
          const uploadPath = req.body?.folder
            ? path.join(uploadDir, req.body.folder)
            : uploadDir;
          ensureUploadDir(uploadPath);
          cb(null, uploadPath);
        },
        filename: (req: UploadRequest, file, cb) => {
          const ext = path.extname(file.originalname);
          const base = path
            .basename(file.originalname, ext)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${base || 'file'}-${unique}${ext}`);
        },
      }),
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
