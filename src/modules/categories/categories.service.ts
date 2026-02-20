import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { setPagination } from 'src/core/utils';
import { generateSlug, isUUID } from 'src/helpers';
import { Pagination } from 'src/shared/interfaces';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const slug = generateSlug(createCategoryDto.name);
    const categoryFound = await this.findBySlugOrId(slug);
    if (categoryFound) {
      throw new BadRequestException('Category already exists');
    }

    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  async findAll(query: QueryCategoryDto): Promise<Pagination<Category>> {
    const { type, search, sort, order, page = 1, limit = 10 } = query;
    console.log(type);

    const queryBuilder = this.categoryRepository.createQueryBuilder('category');
    if (type) {
      queryBuilder.andWhere('category.type = :type', { type });
      if (type === 'skill') {
        queryBuilder.leftJoinAndSelect('category.skills', 'skill');
      }
    }
    if (search) {
      queryBuilder.andWhere('category.name LIKE :search', {
        search: `%${search}%`,
      });
    }
    if (sort) {
      queryBuilder.orderBy(`category.${sort}`, order);
    }

    queryBuilder.skip((page - 1) * limit);
    queryBuilder.take(limit);

    const [items, totalItems] = await queryBuilder.getManyAndCount();

    return {
      data: items,
      pagination: setPagination(totalItems, limit, page, items.length),
    };
  }

  async findOne(id: string) {
    const category = await this.findBySlugOrId(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async findBySlugOrId(identifier: string) {
    const UUID = isUUID(identifier);
    const categoryFound = await this.categoryRepository.findOne({
      where: UUID ? { id: identifier } : { slug: identifier },
    });
    return categoryFound;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    if (updateCategoryDto.name) {
      const slug = generateSlug(updateCategoryDto.name);
      const categoryFound = await this.findBySlugOrId(slug);
      if (categoryFound && categoryFound.id !== category.id) {
        throw new BadRequestException('Category already exists');
      }
    }
    this.categoryRepository.merge(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    return this.categoryRepository.remove(category);
  }
}
