import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { Auth } from 'src/core/decorators';
import { Role } from 'src/core/enums';
import { Response } from 'src/core/utils';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Auth(Role.ADMIN)
  async findAll() {
    const users = await this.usersService.findAll();
    return Response.success(users);
  }

  @Patch(':id')
  @Auth()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(id, updateUserDto);
    return Response.success(user, 'User updated successfully');
  }
}
