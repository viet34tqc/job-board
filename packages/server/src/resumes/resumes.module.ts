import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Resume, ResumeSchema } from './resume.schema';
import { ResumesController } from './resumes.controller';
import { ResumesService } from './resumes.service';

@Module({
  providers: [ResumesService],
  controllers: [ResumesController],
  imports: [
    MongooseModule.forFeature([{ name: Resume.name, schema: ResumeSchema }]),
  ],
})
export class ResumesModule {}
