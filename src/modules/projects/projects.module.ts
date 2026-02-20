import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from '../categories/categories.module';
import { TagsModule } from '../tags/tags.module';
import { TechStacksModule } from '../tech-stacks/tech-stacks.module';
import { ProjectChallenge } from './entities/project-challenge.entity';
import { ProjectResult } from './entities/project-result.entity';
import { Project } from './entities/project.entity';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, ProjectChallenge, ProjectResult]),
    CategoriesModule,
    TagsModule,
    TechStacksModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
