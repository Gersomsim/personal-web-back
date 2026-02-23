import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Category } from 'src/modules/categories/entities/category.entity';

export class CreateSkillDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsNotEmpty()
  @IsUUID()
  categoryId: string;

  category: Category;
}
