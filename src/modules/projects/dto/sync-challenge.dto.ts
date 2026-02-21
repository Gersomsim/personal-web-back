import { Type } from 'class-transformer';
import { IsArray } from 'class-validator';

export class SyncChallengeDto {
  @IsArray()
  @Type(() => Challenge)
  challenges: Challenge[];
}

export class Challenge {
  title: string;
  solution: string;
}
