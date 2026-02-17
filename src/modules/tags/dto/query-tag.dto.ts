import { IsEnum, IsOptional, IsString } from 'class-validator';
import { QueryDto } from 'src/shared/dto';

export class QueryTagDto extends QueryDto {
  @IsString()
  @IsOptional()
  @IsEnum(['blog', 'project'])
  type?: 'blog' | 'project';
}
