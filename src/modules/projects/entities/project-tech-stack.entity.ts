import { Exclude } from 'class-transformer';

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from './project.entity';

@Entity('project_tech_stacks')
export class ProjectTechStack {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100 })
  category: string;

  @Column({ type: 'jsonb' })
  items: string[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Exclude()
  updatedAt: Date;

  @ManyToOne(() => Project, (project) => project.techStack)
  @JoinColumn({ name: 'project_id' })
  project: Project;
}
