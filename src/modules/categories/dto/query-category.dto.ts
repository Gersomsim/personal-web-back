import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryCategoryDto {
  @IsString()
  @IsOptional()
  @IsIn(['blog', 'skill', 'project'])
  type: 'blog' | 'skill' | 'project';

  @IsString()
  @IsOptional()
  search: string;

  @IsString()
  @IsOptional()
  sort: string;

  @IsString()
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order: 'ASC' | 'DESC';

  @IsNumber()
  @IsOptional()
  page: number;

  @IsNumber()
  @IsOptional()
  limit: number;
}
