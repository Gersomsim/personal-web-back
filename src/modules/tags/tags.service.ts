import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { setPagination } from 'src/core/utils';
import { isUUID } from 'src/helpers';
import { Pagination } from 'src/shared/interfaces';
import { In, Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { QueryTagDto } from './dto/query-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}
  create(createTagDto: CreateTagDto) {
    const tag = this.tagRepository.create(createTagDto);
    return this.tagRepository.save(tag);
  }

  async findAll(query: QueryTagDto): Promise<Pagination<Tag>> {
    const { search, limit = 10, order, type, page = 1 } = query;
    const queryBuilder = this.tagRepository.createQueryBuilder('tag');
    if (search) {
      queryBuilder.andWhere('tag.name LIKE :search', { search: `%${search}%` });
    }
    if (type) {
      queryBuilder.andWhere('tag.type = :type', { type });
    }
    if (order) {
      queryBuilder.orderBy('tag.name', order);
    }

    queryBuilder.skip((page - 1) * limit);
    queryBuilder.take(limit);

    const [items, totalItems] = await queryBuilder.getManyAndCount();
    return {
      data: items,
      pagination: setPagination(totalItems, limit, page, items.length),
    };
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    const tag = await this.findByIdOrSlug(id);
    this.tagRepository.merge(tag, updateTagDto);
    return this.tagRepository.save(tag);
  }

  async remove(id: string) {
    const tag = await this.findByIdOrSlug(id);
    return this.tagRepository.remove(tag);
  }
  findByIds(ids: string[]): Promise<Tag[]> {
    return this.tagRepository.find({ where: { id: In(ids) } });
  }
  async findByIdOrSlug(id: string): Promise<Tag> {
    const UUID = isUUID(id);
    const tag = await this.tagRepository.findOne({
      where: UUID ? { id } : { slug: id },
    });
    if (!tag) {
      throw new NotFoundException(`Tag with ${id} not found`);
    }
    return tag;
  }
}
