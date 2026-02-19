import { Exclude } from 'class-transformer';
import { Category } from 'src/modules/categories/entities/category.entity';
import { Tag } from 'src/modules/tags/entities/tag.entity';
import { User } from 'src/modules/users/entities/user.entity';
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

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 255 })
  excerpt: string;

  @Column({ type: 'varchar', length: 255 })
  readTime: string;

  @Column({ type: 'boolean', default: false })
  featured: boolean;

  @Column({ type: 'varchar', length: 255 })
  descriptionSeo: string;

  @Column({ type: 'varchar', length: 255 })
  keywordsSeo: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  image: string;

  @ManyToOne(() => User, (user: User) => user.posts, { eager: true })
  @JoinColumn({ name: 'user_id' })
  author: User;

  @ManyToOne(() => Category, (category: Category) => category.posts, {
    eager: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Exclude()
  updatedAt: Date;

  //Relations
  @ManyToMany(() => Tag, (tag: Tag) => tag.posts, { eager: true })
  @JoinTable({ name: 'post_tags' })
  tags: Tag[];
}
