import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User } from 'src/users/schemas/user.schema';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './schemas/company.schema';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name) private companyModel: SoftDeleteModel<Company>,
  ) {}

  create(createCompanyDto: CreateCompanyDto, user: User) {
    return this.companyModel.create({
      ...createCompanyDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }
  async update(id: string, updateCompanyDto: UpdateCompanyDto, user: User) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new NotFoundException(`Invalid ID ${id}`);
    const updatedCompany = await this.companyModel.findByIdAndUpdate(
      id,
      {
        ...updateCompanyDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
      { new: true },
    );
    if (!updatedCompany)
      throw new NotFoundException(`Company with ID ${id} not found`);
    return updatedCompany;
  }

  async delete(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new NotFoundException(`Invalid ID ${id}`);
    const company = await this.companyModel.findById(id).exec();
    if (!company) throw new NotFoundException('Company not found');
    await this.companyModel.softDelete({ _id: id });
    return { message: 'Company deleted successfully' };
  }
}
