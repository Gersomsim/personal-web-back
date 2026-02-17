import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'src/helpers';
import { Repository } from 'typeorm';
import { CategoriesService } from '../categories/categories.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { QuerySkillDto } from './dto/query-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { Skill } from './entities/skill.entity';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillsRepository: Repository<Skill>,
    private categoryService: CategoriesService,
  ) {}
  async create(createSkillDto: CreateSkillDto) {
    const { categoryId, ...rest } = createSkillDto;
    const categoryFound = await this.categoryService.findBySlugOrId(categoryId);
    if (!categoryFound) {
      throw new NotFoundException('Category not found');
    }
    const skill = this.skillsRepository.create({
      ...rest,
      category: categoryFound,
    });
    return skill;
  }

  findAll(query: QuerySkillDto) {
    const { category, limit, order, search, page } = query;
    const queryBuilder = this.skillsRepository.createQueryBuilder('skill');
    if (category) {
      queryBuilder.leftJoinAndSelect('skill.category', 'category');
      queryBuilder.andWhere('category.slug = :category', { category });
    }
    if (limit) {
      queryBuilder.limit(limit);
    }
    if (order) {
      queryBuilder.orderBy('skill.createdAt', order);
    }
    if (search) {
      queryBuilder.andWhere('skill.name LIKE :search', {
        search: `%${search}%`,
      });
    }
    if (page) {
      queryBuilder.skip((page - 1) * limit);
    }
    if (order) {
      queryBuilder.orderBy('skill.name', order);
    }
    return queryBuilder.getMany();
  }

  async findByIdOrSlug(id: string) {
    const UUID = isUUID(id);
    const skill = await this.skillsRepository.findOne({
      where: UUID ? { id } : { slug: id },
      relations: { category: true },
    });
    if (!skill) throw new NotFoundException(`Skill with ${id} not found`);
    return skill;
  }

  async update(id: string, updateSkillDto: UpdateSkillDto) {
    const skillFound = await this.findByIdOrSlug(id);
    const { categoryId, ...rest } = updateSkillDto;
    if (categoryId) {
      const categoryFound =
        await this.categoryService.findBySlugOrId(categoryId);
      if (!categoryFound) {
        throw new NotFoundException('Category not found');
      }
      skillFound.category = categoryFound;
    }
    this.skillsRepository.merge(skillFound, rest);
    return this.skillsRepository.save(skillFound);
  }

  async remove(id: string) {
    const skillFound = await this.findByIdOrSlug(id);
    return this.skillsRepository.remove(skillFound);
  }
}
