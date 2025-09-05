import { Type } from 'class-transformer';
import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';

class Company {
  @IsNotEmpty()
  _id: Types.ObjectId;
  @IsNotEmpty()
  name: string;
}

// This is for endpoint when admin create user in admin dashboard
export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company?: Company;

  @IsOptional()
  @IsNotEmpty()
  address?: string;

  @IsOptional()
  age?: number;

  @IsOptional()
  gender?: string;

  @IsNotEmpty()
  @IsMongoId()
  role: Types.ObjectId;
}
