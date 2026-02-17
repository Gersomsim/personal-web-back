import { Exclude } from 'class-transformer';
import { Category } from 'src/modules/categories/entities/category.entity';
import { Tag } from 'src/modules/tags/entities/tag.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'varchar', length: 100 })
  subtitle: string;

  @Column({ type: 'varchar', length: 250 })
  summary: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  image: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  link: string;

  @Column({ type: 'varchar', length: 100, default: 'project' })
  type: 'project' | 'experiment';

  @Column({ type: 'varchar', length: 100, nullable: true })
  metrics: string;

  @ManyToOne(() => Category, (category: Category) => category.projects)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'varchar', length: 100 })
  role: string;

  @Column({ type: 'boolean', default: false })
  repoPrivate: boolean;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  repoLink: string;

  @Column({ type: 'date' })
  developedAt: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Exclude()
  updatedAt: Date;

  @ManyToMany(() => Tag, (tag: Tag) => tag.projects)
  @JoinTable({ name: 'project_tags' })
  tags: Tag[];
}
