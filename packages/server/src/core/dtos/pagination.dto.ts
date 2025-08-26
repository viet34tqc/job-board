import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page: number;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit: number;

  @IsOptional()
  @IsString()
  populate?: string;

  @IsOptional()
  @IsString()
  fields?: string;
}
