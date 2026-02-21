import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SyncChallengeDto } from '../dto/sync-challenge.dto';
import { ProjectChallenge } from '../entities/project-challenge.entity';
import { Project } from '../entities/project.entity';

@Injectable()
export class ChallengeService {
  constructor(
    @InjectRepository(ProjectChallenge)
    private readonly challengeRepository: Repository<ProjectChallenge>,
  ) {}
  async syncChallenges(
    project: Project,
    syncChallengeDto: SyncChallengeDto,
  ): Promise<ProjectChallenge[]> {
    const projectId = project.id;
    const challengeDto = syncChallengeDto.challenges;

    return await this.challengeRepository.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager.delete(ProjectChallenge, {
          project: { id: projectId },
        });
        if (challengeDto && challengeDto.length > 0) {
          const newItems: Partial<ProjectChallenge>[] = [];
          challengeDto.forEach((group) => {
            newItems.push({
              title: group.title,
              solution: group.solution,
              project: project,
            });
          });

          if (newItems.length > 0) {
            await transactionalEntityManager.save(ProjectChallenge, newItems);
          }
        }

        return await transactionalEntityManager.find(ProjectChallenge, {
          where: { project: { id: projectId } },
        });
      },
    );
  }
}
