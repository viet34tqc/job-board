import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User } from 'src/users/schemas/user.schema';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company } from './schemas/company.schema';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name) private companyModel: SoftDeleteModel<Company>,
  ) {}

  create(createCompanyDto: CreateCompanyDto, user: User) {
    console.log('user', user);
    return this.companyModel.create(createCompanyDto);
  }
}
