import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsBoolean()
  isActive: boolean;

  @IsArray()
  @IsMongoId({ each: true })
  permissions: Types.ObjectId[];
}
