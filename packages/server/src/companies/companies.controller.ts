import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { UserDecorator } from 'src/auth/decoratots/auth.decorator';
import { User } from 'src/users/schemas/user.schema';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './schemas/company.schema';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(
    @Body() createCompanyDto: CreateCompanyDto,
    @UserDecorator() user: User, // The user here is from the UserDecorator which is from the validate function in jwt strategy
  ): Promise<Company> {
    return this.companiesService.create(createCompanyDto, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @UserDecorator() user: User,
  ) {
    return this.companiesService.update(id, updateCompanyDto, user);
  }
}
