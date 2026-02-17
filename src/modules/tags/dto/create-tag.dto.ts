import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsIn(['blog', 'project'])
  type: 'blog' | 'project';

  @IsNotEmpty()
  @IsString()
  description: string;
}
