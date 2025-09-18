import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';

@Injectable()
export class S3Service {
  private s3: S3Client;
  private bucket: string;

  constructor(private configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.get<string>('awsRegion')!,
      credentials: {
        accessKeyId: this.configService.get<string>('awsAccessKey')!,
        secretAccessKey: this.configService.get<string>('awsSecretAccessKey')!,
      },
    });
    this.bucket = this.configService.get<string>('awsBucketName')!;
  }

  validateFile(filename: string, mimetype: string, size: number) {
    const allowedTypes = [
      'application/pdf',
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    ];

    if (!allowedTypes.includes(mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only PDF/DOC/DOCX allowed.',
      );
    }

    const maxSize = 5 * 1024 * 1024;
    if (size > maxSize) {
      throw new BadRequestException('File too large. Max 5MB allowed.');
    }
  }

  async getUploadUrl(filename: string, mimetype: string, size: number) {
    this.validateFile(filename, mimetype, size);

    const key = `cvs/${randomUUID()}-${filename}`;
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: mimetype,
    });

    const url = await getSignedUrl(this.s3, command, { expiresIn: 600 }); // 10 min
    return { key, url };
  }

  async getDownloadUrl(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(this.s3, command, { expiresIn: 600 }); // 10 min
  }
}
