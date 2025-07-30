import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// This is for endpoint when user register in frontend
export class RegisterUserDto extends OmitType(CreateUserDto, [
  'role',
  'company',
]) {}
