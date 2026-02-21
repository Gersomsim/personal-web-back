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
import { SyncChallengeDto } from './dto/sync-challenge.dto';
import { SyncResultDto } from './dto/sync-result.dto';
import { SyncTechStackDto } from './dto/sync-tech-stack.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';
import { ChallengeService, ResultService, TechStackService } from './services';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly techStackService: TechStackService,
    private readonly challengeService: ChallengeService,
    private readonly resultService: ResultService,
  ) {}

  @Post()
  @Auth(Role.ADMIN)
  async create(@Body() createProjectDto: CreateProjectDto) {
    const pro = await this.projectsService.create(createProjectDto);
    return Response.success(pro, 'Project created successfully');
  }

  @Get()
  async findAll(@Query() query: QueryProjectDto) {
    const { data, pagination } = await this.projectsService.findAll(query);
    return Response.success(data, '', pagination);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const pro = await this.projectsService.findOne(id);
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
  @Patch('sync-tech-stack/:id')
  @Auth(Role.ADMIN)
  async syncTechStack(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() syncTechStackDto: SyncTechStackDto,
  ) {
    const project = await this.projectsService.findOne(id);
    const techStack = await this.techStackService.syncTechStack(
      project,
      syncTechStackDto,
    );
    return Response.success(
      techStack,
      'Project tech stack synced successfully',
    );
  }
  @Patch('sync-challenges/:id')
  @Auth(Role.ADMIN)
  async syncChallenges(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() syncChallengeDto: SyncChallengeDto,
  ) {
    const project = await this.projectsService.findOne(id);
    const challenges = await this.challengeService.syncChallenges(
      project,
      syncChallengeDto,
    );
    return Response.success(
      challenges,
      'Project challenges synced successfully',
    );
  }
  @Patch('sync-result/:id')
  @Auth(Role.ADMIN)
  async syncResult(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() syncResultDto: SyncResultDto,
  ) {
    const project = await this.projectsService.findOne(id);
    const result = await this.resultService.syncResult(project, syncResultDto);
    return Response.success(result, 'Project result synced successfully');
  }
}
