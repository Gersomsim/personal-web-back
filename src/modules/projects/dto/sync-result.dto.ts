import { Type } from 'class-transformer';
import { IsArray } from 'class-validator';

export class SyncResultDto {
  @IsArray()
  @Type(() => ResultDto)
  result: ResultDto[];
}

export class ResultDto {
  label: string;
  value: string;
  description: string;
}
