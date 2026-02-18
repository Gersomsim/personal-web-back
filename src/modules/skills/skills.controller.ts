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
import { CreateSkillDto } from './dto/create-skill.dto';
import { QuerySkillDto } from './dto/query-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { SkillsService } from './skills.service';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  @Auth(Role.ADMIN)
  async create(@Body() createSkillDto: CreateSkillDto) {
    const skill = await this.skillsService.create(createSkillDto);
    return Response.success(skill, 'Skill created successfully');
  }

  @Get()
  async findAll(@Query() query: QuerySkillDto) {
    const { data, pagination } = await this.skillsService.findAll(query);
    return Response.success(data, '', pagination);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const skill = await this.skillsService.findByIdOrSlug(id);
    return Response.success(skill);
  }

  @Patch(':id')
  @Auth(Role.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateSkillDto: UpdateSkillDto,
  ) {
    const skill = await this.skillsService.update(id, updateSkillDto);
    return Response.success(skill, 'Skill updated successfully');
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  async remove(@Param('id') id: string) {
    const skill = await this.skillsService.remove(id);
    return Response.success(skill, 'Skill deleted successfully');
  }
}
