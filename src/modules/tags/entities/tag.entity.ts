import { Exclude } from 'class-transformer';
import { Post } from 'src/modules/posts/entities/post.entity';
import { Project } from 'src/modules/projects/entities/project.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100, default: 'blog' })
  type: 'blog' | 'project';

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Exclude()
  updatedAt: Date;

  //Relations
  @ManyToMany(() => Post, (post: Post) => post.tags)
  posts: Post[];

  @ManyToMany(() => Project, (project: Project) => project.tags)
  projects: Project[];

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9-]/g, '');
  }
}
