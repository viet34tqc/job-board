import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { IsPublic, UserDecorator } from 'src/auth/decoratots/auth.decorator';
import { PaginationDto } from 'src/core/dtos/pagination.dto';
import { ResponseMessage } from 'src/core/interceptors/transformData.interceptor';
import { UserDocument } from 'src/users/schemas/user.schema';
import { CreateJobDto } from './dtos/create-job.dto';
import { UpdateJobDto } from './dtos/update-job.dto';
import { JobDocument } from './jobs.schema';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Post()
  create(
    @Body() createJobDto: CreateJobDto,
    @UserDecorator() user: UserDocument,
  ): Promise<JobDocument> {
    return this.jobsService.create(createJobDto, user);
  }

  @IsPublic()
  @Get()
  @ResponseMessage('Get all jobs successfully')
  findAll(@Query() query: PaginationDto) {
    return this.jobsService.findAll(query);
  }

  @IsPublic()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @UserDecorator() user: UserDocument,
  ) {
    return this.jobsService.update(id, updateJobDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @UserDecorator() user: UserDocument) {
    return this.jobsService.remove(id, user);
  }
}
