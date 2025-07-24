import { Body, Controller, Post } from '@nestjs/common';
import { UserDecorator } from 'src/auth/decoratots/auth.decorator';
import { User } from 'src/users/schemas/user.schema';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
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
}
