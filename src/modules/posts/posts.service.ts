import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { setPagination } from 'src/core/utils';
import { isUUID } from 'src/helpers';
import { Pagination } from 'src/shared/interfaces';
import { FindOptionsOrder, FindOptionsWhere, Like, Repository } from 'typeorm';
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
    const { categoryId } = payload;
    const category = await this.getCategory(categoryId);
    let tags: Tag[] = [];
    if (payload.tagsId) {
      tags = await this.getTags(payload.tagsId);
      console.log(tags);
    }

    const post = this.postRepository.create({
      ...payload,
      category: category!,
      tags: tags,
    });
    return await this.postRepository.save(post);
  }

  async findAll(query: QueryPostDto): Promise<Pagination<Post>> {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      tag,
      author,
      mostRead,
    } = query;
    const where: FindOptionsWhere<Post> = {};
    const order: FindOptionsOrder<Post> = {};
    if (mostRead) {
      order.sometimesRead = 'DESC';
    } else {
      order.createdAt = 'DESC';
    }
    if (search) {
      where['title'] = Like(`%${search}%`);
    }
    if (category) {
      const categoryFound =
        await this.categoriesService.findBySlugOrId(category);
      console.log({ categoryFound });

      if (categoryFound) {
        where.category = { id: categoryFound.id } as any;
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
    const [items, totalItems] = await this.postRepository.findAndCount({
      where,
      take: limit,
      skip: (page - 1) * limit,
      order,
    });
    return {
      data: items,
      pagination: setPagination(totalItems, limit, page, items.length),
    };
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
    return await this.postRepository.save({
      ...post,
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
    return await this.postRepository.remove(post);
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
  async markAsRead(id: string) {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
    post.sometimesRead++;
    await this.postRepository.save(post);
  }
}
