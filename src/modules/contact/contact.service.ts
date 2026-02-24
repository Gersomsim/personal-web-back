import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { setPagination } from 'src/core/utils';
import { Pagination } from 'src/shared/interfaces';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateContactDto } from './dto/create-contact.dto';
import { QueryContactDto } from './dto/query-contact.dto';
import { Contact } from './entities/contact.entity';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}
  create(createContactDto: CreateContactDto) {
    const contact = this.contactRepository.create(createContactDto);
    return this.contactRepository.save(contact);
  }

  async findAll(
    queryContactDto: QueryContactDto,
  ): Promise<Pagination<Contact>> {
    const { limit = 10, read, page = 1 } = queryContactDto;
    const where: FindOptionsWhere<Contact> = {};
    if (read !== undefined) {
      where.read = read;
    }
    const [items, count] = await this.contactRepository.findAndCount({
      where,
      take: limit,
      skip: (page - 1) * limit,
      order: {
        createdAt: 'DESC',
      },
    });
    return {
      data: items,
      pagination: setPagination(count, limit, page, items.length),
    };
  }

  async findOne(id: number) {
    const contact = await this.contactRepository.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException('Contact not found');
    }
    return contact;
  }

  async update(id: number) {
    const contact = await this.findOne(id);
    contact.read = true;
    return this.contactRepository.save(contact);
  }

  async remove(id: number) {
    const contact = await this.findOne(id);
    return this.contactRepository.remove(contact);
  }
}
