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
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { UpdateCompanyDto } from './dtos/update-company.dto';
import { CompanyDocument } from './schemas/company.schema';

import { ApiTags } from '@nestjs/swagger';

@ApiTags('Companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(
    @Body() createCompanyDto: CreateCompanyDto,
    @UserDecorator() user: UserDocument, // The user here is from the UserDecorator which is from the validate function in jwt strategy
  ): Promise<CompanyDocument> {
    return this.companiesService.create(createCompanyDto, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @UserDecorator() user: UserDocument,
  ) {
    return this.companiesService.update(id, updateCompanyDto, user);
  }

  @Get()
  @IsPublic()
  @ResponseMessage('Get all companies successfully')
  findAll(@Query() query: PaginationDto) {
    return this.companiesService.findAll(query);
  }

  @Get(':id')
  @IsPublic()
  @ResponseMessage('Get company successfully')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @UserDecorator() user: UserDocument) {
    return this.companiesService.delete(id, user);
  }
}
