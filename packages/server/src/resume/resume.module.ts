import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResumeController } from './resume.controller';
import { Resume, ResumeSchema } from './resume.schema';
import { ResumeService } from './resume.service';

@Module({
  providers: [ResumeService],
  controllers: [ResumeController],
  imports: [
    MongooseModule.forFeature([{ name: Resume.name, schema: ResumeSchema }]),
  ],
})
export class ResumeModule {}
