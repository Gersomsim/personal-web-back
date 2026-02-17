import { Exclude } from 'class-transformer';
import { Post } from 'src/modules/posts/entities/post.entity';
import { Project } from 'src/modules/projects/entities/project.entity';
import { Skill } from 'src/modules/skills/entities/skill.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 100, default: 'blog' })
  type: 'blog' | 'skill' | 'project';

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Exclude()
  updatedAt: Date;

  //Relations
  @OneToMany(() => Post, (post: Post) => post.category)
  posts: Post[];

  @OneToMany(() => Project, (project: Project) => project.category)
  projects: Project[];

  @OneToMany(() => Skill, (skill: Skill) => skill.category)
  skills: Skill[];

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
