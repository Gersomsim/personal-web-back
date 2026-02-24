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

  @IsOptional()
  @IsString()
  subtitle: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  problem: string;

  @IsOptional()
  @IsString()
  solution: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsOptional()
  @IsArray()
  tagsId: string[];

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsOptional()
  @IsString()
  metrics: string;

  @IsIn(['project', 'experiment'])
  type: 'project' | 'experiment';

  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @IsNotEmpty()
  @IsBoolean()
  featured: boolean;

  @IsOptional()
  @IsString()
  liveUrl: string;

  @IsOptional()
  @IsString()
  repoUrl: string;

  @IsNotEmpty()
  @IsBoolean()
  repoPrivate: boolean;

  @IsNotEmpty()
  @IsString()
  role: string;

  @IsOptional()
  @IsString()
  duration: string;

  @IsOptional()
  @IsString()
  team: string;

  @IsNotEmpty()
  @IsDate()
  developedAt: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  learnings: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features: string[];

  category: Category;
  tags: Tag[];
}
