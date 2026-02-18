import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Auth } from 'src/core/decorators';
import { Role } from 'src/core/enums';
import { Response } from 'src/core/utils';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Auth(Role.ADMIN, Role.EDITOR)
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const cat = await this.categoriesService.create(createCategoryDto);
    return Response.success(cat);
  }

  @Get()
  async findAll(@Query() query: QueryCategoryDto) {
    const cats = await this.categoriesService.findAll(query);
    return Response.success(cats, 'Categories retrieved successfully');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const cat = await this.categoriesService.findOne(id);
    return Response.success(cat);
  }

  @Patch(':id')
  @Auth(Role.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const cat = await this.categoriesService.update(id, updateCategoryDto);
    return Response.success(cat, 'Category updated successfully');
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  async remove(@Param('id') id: string) {
    const cat = await this.categoriesService.remove(id);
    return Response.success(cat, 'Category deleted successfully');
  }
}
