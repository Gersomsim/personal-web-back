import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SyncResultDto } from '../dto/sync-result.dto';
import { ProjectResult } from '../entities/project-result.entity';
import { Project } from '../entities/project.entity';

@Injectable()
export class ResultService {
  constructor(
    @InjectRepository(ProjectResult)
    private readonly resultRepository: Repository<ProjectResult>,
  ) {}

  async syncResult(
    project: Project,
    syncResultDto: SyncResultDto,
  ): Promise<ProjectResult[]> {
    const projectId = project.id;
    const resultDto = syncResultDto.result;

    return await this.resultRepository.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager.delete(ProjectResult, {
          project: { id: projectId },
        });
        if (resultDto && resultDto.length > 0) {
          const newItems: Partial<ProjectResult>[] = [];
          resultDto.forEach((group) => {
            newItems.push({
              label: group.label,
              value: group.value,
              description: group.description,
              project: project,
            });
          });

          if (newItems.length > 0) {
            await transactionalEntityManager.save(ProjectResult, newItems);
          }
        }

        return await transactionalEntityManager.find(ProjectResult, {
          where: { project: { id: projectId } },
        });
      },
    );
  }
}
