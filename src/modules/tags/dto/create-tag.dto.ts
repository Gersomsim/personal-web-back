import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsIn(['blog', 'project'])
  type: 'blog' | 'project';

  @IsOptional()
  @IsString()
  description: string;
}
