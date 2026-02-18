import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'src/helpers';
import { Like, Repository } from 'typeorm';
import { CategoriesService } from '../categories/categories.service';
import { Tag } from '../tags/entities/tag.entity';
import { TagsService } from '../tags/tags.service';
import { UsersService } from '../users/users.service';
import { CreatePostDto } from './dto/create-post.dto';
import { QueryPostDto } from './dto/query-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private categoriesService: CategoriesService,
    private usersService: UsersService,
    private tagsService: TagsService,
  ) {}

  async create(payload: CreatePostDto) {
    const postWithSlug = await this.findByIdOrSlug(payload.slug);
    if (postWithSlug) {
      throw new Error('Post already exists');
    }
    const { categoryId, tagsId, authorId } = payload;
    const category = await this.getCategory(categoryId);
    const author = await this.usersService.findById(authorId);
    const tags = await this.getTags(tagsId);
    const post = this.postRepository.create({
      ...payload,
      category: category!,
      author: author!,
      tags: tags,
    });
    return await this.postRepository.save(post);
  }

  async findAll(query: QueryPostDto) {
    const { page = 1, limit = 10, search, category, tag, author } = query;
    const where = {};
    if (search) {
      where['title'] = Like(`%${search}%`);
    }
    if (category) {
      const categoryFound =
        await this.categoriesService.findBySlugOrId(category);
      if (categoryFound) {
        where['category'] = categoryFound;
      }
    }
    if (tag) {
      const tagFound = await this.tagsService.findByIdOrSlug(tag);
      if (tagFound) {
        where['tags'] = tagFound;
      }
    }
    if (author) {
      const authorFound = await this.usersService.findById(author);
      if (authorFound) {
        where['author'] = authorFound;
      }
    }
    return await this.postRepository.find({
      where,
      take: limit,
      skip: (page - 1) * limit,
    });
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
    const { categoryId, tagsId } = updatePostDto;
    const category = await this.getCategory(categoryId!);
    let tags: Tag[] = [];
    if (tagsId) {
      tags = await this.getTags(tagsId);
    }
    return await this.postRepository.update(id, {
      ...updatePostDto,
      category: category!,
      tags: tags,
    });
  }

  async remove(id: string) {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
    return post;
  }

  async findByIdOrSlug(identifier: string) {
    const UUID = isUUID(identifier);

    return this.postRepository.findOne({
      where: UUID ? { id: identifier } : { slug: identifier },
      relations: ['author', 'category', 'tags'],
    });
  }
  private async getTags(tagsIds: string[]) {
    const tags = await this.tagsService.findByIds(tagsIds);
    return tags;
  }
  private async getCategory(categoryId: string) {
    const category = await this.categoriesService.findBySlugOrId(categoryId);
    return category;
  }
}
