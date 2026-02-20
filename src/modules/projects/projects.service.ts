import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { setPagination } from 'src/core/utils';
import { isUUID } from 'src/helpers';
import { Pagination } from 'src/shared/interfaces';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
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
    console.log(tags);

    const project = this.projectRepository.create({
      ...rest,
      category: category,
      tags: tags,
    });
    return this.projectRepository.save(project);
  }

  async findAll(query: QueryProjectDto): Promise<Pagination<Project>> {
    const { limit = 10, search, category, page = 1 } = query;
    const where: FindOptionsWhere<Project> = {};

    if (search) {
      where.title = Like(`%${search}%`);
    }
    if (category) {
      const categoryFound = await this.categoryService.findBySlugOrId(category);
      if (categoryFound) {
        where.category = categoryFound;
      }
    }

    const [items, totalItems] = await this.projectRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      data: items,
      pagination: setPagination(totalItems, limit, page, items.length),
    };
  }

  async findOne(id: string) {
    const UUID = isUUID(id);
    const project = await this.projectRepository.findOne({
      where: UUID ? { id } : { slug: id },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const project = await this.findOne(id);
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
