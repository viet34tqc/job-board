import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { PaginationDto } from 'src/core/dtos/pagination.dto';
import { UserDocument } from 'src/users/schemas/user.schema';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument } from './schemas/company.schema';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private companyModel: SoftDeleteModel<CompanyDocument>,
  ) {}

  create(createCompanyDto: CreateCompanyDto, user: UserDocument) {
    return this.companyModel.create({
      ...createCompanyDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }
  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
    user: UserDocument,
  ) {
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

  async delete(id: string, user: UserDocument) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new NotFoundException(`Invalid ID ${id}`);
    const company = await this.companyModel.findById(id).exec();
    if (!company) throw new NotFoundException('Company not found');
    const deletedCompany = await this.companyModel.softDelete({ _id: id });
    if (deletedCompany.deleted !== 0) {
      await this.companyModel.findByIdAndUpdate(id, {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      });
    }
    return { message: 'Company deleted successfully' };
  }

  async findAll({ page: currentPage, limit, ...qs }: PaginationDto) {
    const { filter, population } = aqp(qs);
    delete filter.page;
    delete filter.limit;
    const defaultLimit = limit ?? 10;
    const skip = (currentPage - 1) * defaultLimit;
    const totalItems = await this.companyModel.find(filter).countDocuments();
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const results = await this.companyModel
      .find(filter)
      .skip(skip)
      .limit(defaultLimit)
      .populate(population)
      .exec();

    return {
      meta: {
        pageSize: defaultLimit,
        currentPage: currentPage,
        totalPages,
        totalItems,
      },
      results,
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new NotFoundException(`Invalid ID ${id}`);
    const company = await this.companyModel.findById(id).exec();
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }
}
