import { Exclude } from 'class-transformer';
import { Category } from 'src/modules/categories/entities/category.entity';
import { ProjectTechStack } from 'src/modules/projects/entities/project-tech-stack.entity';
import { Tag } from 'src/modules/tags/entities/tag.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProjectChallenge } from './project-challenge.entity';
import { ProjectResult } from './project-result.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  subtitle: string;

  @Column({ type: 'varchar', length: 250 })
  description: string;

  @Column({ type: 'text', nullable: true })
  problem: string;

  @Column({ type: 'text', nullable: true })
  solution: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  image: string;

  @Column({ type: 'varchar', length: 250, nullable: true, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 100, default: 'project' })
  type: 'project' | 'experiment';

  @Column({ type: 'varchar', length: 100, nullable: true })
  metrics: string;

  @ManyToOne(() => Category, (category: Category) => category.projects, {
    eager: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'boolean', default: false })
  featured: boolean;

  @Column({ type: 'varchar', length: 250, nullable: true })
  liveUrl: string;

  @Column({ type: 'varchar', length: 250, nullable: true })
  repoUrl: string;

  @Column({ type: 'boolean', default: true })
  repoPrivate: boolean;

  @Column({ type: 'varchar', length: 100 })
  role: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  team: string;

  @Column({ type: 'date' })
  developedAt: Date;

  @Column({ type: 'json', nullable: true })
  gallery: string[];

  @Column({ type: 'varchar', length: 100, nullable: true })
  duration: string;

  @Column({ type: 'jsonb', nullable: true })
  features: string[];

  @Column({ type: 'jsonb', nullable: true })
  learnings: string[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Exclude()
  updatedAt: Date;

  @OneToMany(() => ProjectChallenge, (challenge) => challenge.project, {
    eager: true,
  })
  challenges: ProjectChallenge[];

  @OneToMany(() => ProjectResult, (result) => result.project, { eager: true })
  results: ProjectResult[];

  @ManyToMany(() => Tag, (tag: Tag) => tag.projects, { eager: true })
  @JoinTable({ name: 'project_tags' })
  tags: Tag[];

  @OneToMany(() => ProjectTechStack, (techStack) => techStack.project, {
    eager: true,
  })
  techStack: ProjectTechStack[];
}
