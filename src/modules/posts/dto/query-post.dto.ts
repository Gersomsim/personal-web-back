import { IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryPostDto {
  @IsOptional()
  @IsNumber()
  page: number;

  @IsOptional()
  @IsNumber()
  limit: number;

  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  tag: string;

  @IsOptional()
  @IsString()
  author: string;
}
