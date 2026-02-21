import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from '../categories/categories.module';
import { TagsModule } from '../tags/tags.module';
import { ProjectChallenge } from './entities/project-challenge.entity';
import { ProjectResult } from './entities/project-result.entity';
import { ProjectTechStack } from './entities/project-tech-stack.entity';
import { Project } from './entities/project.entity';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { ChallengeService, ResultService, TechStackService } from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      ProjectChallenge,
      ProjectResult,
      ProjectTechStack,
    ]),
    CategoriesModule,
    TagsModule,
  ],
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    TechStackService,
    ChallengeService,
    ResultService,
  ],
})
export class ProjectsModule {}
