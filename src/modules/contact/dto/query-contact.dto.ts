import { IsBoolean, IsOptional } from 'class-validator';
import { QueryDto } from 'src/shared/dto';

export class QueryContactDto extends QueryDto {
  @IsBoolean()
  @IsOptional()
  read?: boolean;
}
