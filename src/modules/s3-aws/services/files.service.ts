import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { File } from '../entities/file.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {}

  getFilesByIds(ids: string[]): Promise<File[]> {
    return this.fileRepository.find({ where: { id: In(ids) } });
  }
}
