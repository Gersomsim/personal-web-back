import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { setPagination } from 'src/core/utils';
import { Pagination } from 'src/shared/interfaces';
import { Repository } from 'typeorm';
import { CategoriesService } from '../categories/categories.service';
import { TagsService } from '../tags/tags.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { QueryProjectDto } from './dto/query-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private categoryService: CategoriesService,
    private tagService: TagsService,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    const { categoryId, tagsId, ...rest } = createProjectDto;
    const category = await this.categoryService.findBySlugOrId(categoryId);
    if (!category) {
      throw new BadRequestException('Category not found');
    }
    const tags = await this.getTags(tagsId);
    const project = this.projectRepository.create({ ...rest, category, tags });
    return this.projectRepository.save(project);
  }

  async findAll(query: QueryProjectDto): Promise<Pagination<Project>> {
    const {
      limit = 10,
      search,
      category,
      order,
      page = 1,
      sort,
      tags: tag,
    } = query;
    const queryBuilder = this.projectRepository.createQueryBuilder('project');
    if (search) {
      queryBuilder.andWhere('project.title ILIKE :search', {
        search: `%${search}%`,
      });
    }
    if (category) {
      const categoryFound = await this.categoryService.findBySlugOrId(category);
      if (categoryFound) {
        queryBuilder.andWhere('category = :category', {
          category: categoryFound,
        });
      }
    }
    if (order && sort) {
      queryBuilder.orderBy(sort, order);
    }
    queryBuilder.skip((page - 1) * limit);
    queryBuilder.take(limit);
    if (tag) {
      const tagsArray = tag.split(',');
      queryBuilder.leftJoin('project.tags', 'tag');
      queryBuilder.andWhere('tag.slug IN (:...tags)', {
        tags: tagsArray,
      });
    }
    const [items, totalItems] = await queryBuilder.getManyAndCount();
    return {
      data: items,
      pagination: setPagination(totalItems, limit, page, items.length),
    };
  }

  async findOneById(id: string) {
    const project = await this.projectRepository.findOne({
      where: { id },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const project = await this.findOneById(id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    const { categoryId, ...rest } = updateProjectDto;
    if (categoryId) {
      const category = await this.categoryService.findBySlugOrId(categoryId);
      if (!category) {
        throw new BadRequestException('Category not found');
      }
      project.category = category;
    }
    this.projectRepository.merge(project, rest);
    return this.projectRepository.save(project);
  }

  remove(id: string) {
    return this.projectRepository.delete(id);
  }
  private async getTags(tagsId: string[]) {
    return this.tagService.findByIds(tagsId);
  }
}
