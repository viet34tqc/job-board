import { IsNotEmpty, IsString } from 'class-validator';

export class ServeFileDto {
  @IsString()
  @IsNotEmpty()
  filePath: string;
}
