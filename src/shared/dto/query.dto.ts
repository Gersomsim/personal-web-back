import { IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryDto {
  @IsString()
  @IsOptional()
  search: string;

  @IsNumber()
  @IsOptional()
  page: number;

  @IsNumber()
  @IsOptional()
  limit: number;

  @IsString()
  @IsOptional()
  sort: string;

  @IsString()
  @IsOptional()
  order: 'ASC' | 'DESC';
}
