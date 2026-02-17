import {
  IsArray,
  IsBoolean,
  IsDate,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Category } from 'src/modules/categories/entities/category.entity';
import { Tag } from 'src/modules/tags/entities/tag.entity';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  subtitle: string;

  @IsNotEmpty()
  @IsString()
  summary: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsString()
  @IsOptional()
  link: string;

  @IsIn(['project', 'experiment'])
  type: 'project' | 'experiment';

  @IsOptional()
  @IsString()
  metrics: string;

  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @IsNotEmpty()
  @IsString()
  role: string;

  @IsNotEmpty()
  @IsBoolean()
  repoPrivate: boolean;

  @IsOptional()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  repoLink: string;

  @IsNotEmpty()
  @IsDate()
  developedAt: Date;

  @IsOptional()
  @IsArray()
  tagsId: string[];

  category: Category;
  tags: Tag[];
}
