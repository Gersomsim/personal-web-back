import { IsOptional, IsString } from 'class-validator';
import { QueryDto } from 'src/shared/dto';

export class QuerySkillDto extends QueryDto {
  @IsString()
  @IsOptional()
  category: string;
}
