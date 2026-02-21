import { Type } from 'class-transformer';
import { IsArray } from 'class-validator';

export class SyncTechStackDto {
  @IsArray()
  @Type(() => TechStack)
  techStack: TechStack[];
}

export class TechStack {
  category: string;
  items: string[];
}
