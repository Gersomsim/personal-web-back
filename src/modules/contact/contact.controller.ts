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
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { QueryContactDto } from './dto/query-contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async create(@Body() createContactDto: CreateContactDto) {
    const data = await this.contactService.create(createContactDto);
    return Response.success(data, 'Message sent successfully');
  }

  @Get()
  @Auth(Role.ADMIN)
  async findAll(@Query() queryContactDto: QueryContactDto) {
    const { data, pagination } =
      await this.contactService.findAll(queryContactDto);
    return Response.success(data, '', pagination);
  }

  @Get(':id')
  @Auth(Role.ADMIN)
  async findOne(@Param('id') id: string) {
    const data = await this.contactService.findOne(+id);
    return Response.success(data, '');
  }

  @Patch(':id')
  @Auth(Role.ADMIN)
  async update(@Param('id') id: string) {
    const data = await this.contactService.update(+id);
    return Response.success(data, 'Message marked as read');
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  async remove(@Param('id') id: string) {
    await this.contactService.remove(+id);
    return Response.success(null, 'Message deleted successfully');
  }
}
