import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Category } from 'src/modules/categories/entities/category.entity';

export class CreateSkillDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  content: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsString()
  @IsOptional()
  certificate: string;

  @IsString()
  @IsOptional()
  certificateUrl: string;

  @IsNotEmpty()
  @IsUUID()
  categoryId: string;

  category: Category;
}
