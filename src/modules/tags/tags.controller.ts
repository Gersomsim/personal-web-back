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
import { CreateTagDto } from './dto/create-tag.dto';
import { QueryTagDto } from './dto/query-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @Auth(Role.ADMIN, Role.EDITOR)
  async create(@Body() createTagDto: CreateTagDto) {
    const tag = await this.tagsService.create(createTagDto);
    return Response.success(tag, 'Tag created successfully');
  }

  @Get()
  async findAll(@Query() query: QueryTagDto) {
    const tag = await this.tagsService.findAll(query);
    return Response.success(tag);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const tag = await this.tagsService.findByIdOrSlug(id);
    return Response.success(tag);
  }

  @Patch(':id')
  @Auth(Role.ADMIN)
  async update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    const tag = await this.tagsService.update(id, updateTagDto);
    return Response.success(tag, 'Tag updated successfully');
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  async remove(@Param('id') id: string) {
    const tag = await this.tagsService.remove(id);
    return Response.success(tag, 'Tag deleted successfully');
  }
}
