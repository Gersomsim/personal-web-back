import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class QueryProjectDto {
  @IsOptional()
  search: string;

  @IsOptional()
  category: string;

  @IsOptional()
  tags: string;

  @IsOptional()
  @IsNumber()
  page: number;

  @IsOptional()
  @IsNumber()
  limit: number;

  @IsOptional()
  sort: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order: 'ASC' | 'DESC';

  @IsOptional()
  @IsBoolean()
  featured: boolean;

  @IsOptional()
  @IsString()
  type: 'project' | 'experiment';
}
