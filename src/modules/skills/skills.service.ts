import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { setPagination } from 'src/core/utils';
import { Pagination } from 'src/shared/interfaces';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
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
    return this.skillsRepository.save(skill);
  }

  async findAll(query: QuerySkillDto): Promise<Pagination<Skill>> {
    const { category, limit = 10, order, search, page = 1 } = query;
    const where: FindOptionsWhere<Skill> = {};
    if (category) {
      where.category = { slug: category };
    }
    if (search) {
      where.name = Like(`%${search}%`);
    }

    const [items, totalItems] = await this.skillsRepository.findAndCount({
      where,
      relations: { category: true },
      order: { name: order },
      take: limit,
      skip: (page - 1) * limit,
    });
    return {
      data: items,
      pagination: setPagination(totalItems, limit, page, items.length),
    };
  }

  async findByIdOrSlug(id: string) {
    const isNumber = !isNaN(Number(id));
    const idNumber = Number(id);
    const skill = await this.skillsRepository.findOne({
      where: isNumber ? { id: idNumber } : { slug: id },
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
