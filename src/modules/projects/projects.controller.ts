import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Auth } from 'src/core/decorators';
import { Role } from 'src/core/enums';
import { Response } from 'src/core/utils';
import { CreateProjectDto } from './dto/create-project.dto';
import { QueryProjectDto } from './dto/query-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Auth(Role.ADMIN)
  async create(@Body() createProjectDto: CreateProjectDto) {
    const pro = await this.projectsService.create(createProjectDto);
    return Response.success(pro, 'Project created successfully');
  }

  @Get()
  async findAll(@Query() query: QueryProjectDto) {
    const pro = await this.projectsService.findAll(query);
    return Response.success(pro);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const pro = await this.projectsService.findOneById(id);
    return Response.success(pro);
  }

  @Patch(':id')
  @Auth(Role.ADMIN)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    const pro = await this.projectsService.update(id, updateProjectDto);
    return Response.success(pro, 'Project updated successfully');
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const pro = await this.projectsService.remove(id);
    return Response.success(pro, 'Project deleted successfully');
  }
}
