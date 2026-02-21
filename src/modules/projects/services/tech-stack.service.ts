import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SyncTechStackDto } from '../dto/sync-tech-stack.dto';
import { ProjectTechStack } from '../entities/project-tech-stack.entity';
import { Project } from '../entities/project.entity';

@Injectable()
export class TechStackService {
  constructor(
    @InjectRepository(ProjectTechStack)
    private readonly techStackRepository: Repository<ProjectTechStack>,
  ) {}

  async syncTechStack(
    project: Project,
    synctechStackDto: SyncTechStackDto,
  ): Promise<ProjectTechStack[]> {
    const techStackDto = synctechStackDto.techStack;

    return await this.techStackRepository.manager.transaction(
      async (transactionalEntityManager) => {
        // 1. Eliminamos todo el stack actual de este proyecto
        await transactionalEntityManager.delete(ProjectTechStack, {
          project: { id: project.id },
        });

        // 2. Si el arreglo no está vacío, preparamos los nuevos registros
        if (techStackDto && techStackDto.length > 0) {
          const newItems: Partial<ProjectTechStack>[] = [];

          techStackDto.forEach((group) => {
            newItems.push({
              category: group.category,
              items: group.items,
              project: project,
            });
          });

          // 3. Insertamos los nuevos de golpe
          if (newItems.length > 0) {
            await transactionalEntityManager.save(ProjectTechStack, newItems);
          }
        }

        // 4. Retornamos el stack actualizado
        return await transactionalEntityManager.find(ProjectTechStack, {
          where: { project: { id: project.id } },
        });
      },
    );
  }
}
