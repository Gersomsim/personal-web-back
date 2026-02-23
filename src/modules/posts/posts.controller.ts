import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Auth, GetUser } from 'src/core/decorators';
import { Role } from 'src/core/enums';
import { Response } from 'src/core/utils';
import { User } from '../users/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { QueryPostDto } from './dto/query-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @Auth(Role.ADMIN, Role.EDITOR)
  async create(@Body() createPostDto: CreatePostDto, @GetUser() user: User) {
    createPostDto.author = user;
    const post = await this.postsService.create(createPostDto);
    return Response.success(post, 'Post created successfully');
  }

  @Get()
  async findAll(@Query() query: QueryPostDto) {
    const { data, pagination } = await this.postsService.findAll(query);
    return Response.success(data, '', pagination);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const post = await this.postsService.findByIdOrSlug(id);
    return Response.success(post);
  }

  @Patch(':id')
  @Auth(Role.ADMIN, Role.EDITOR)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const post = await this.postsService.update(id, updatePostDto);
    return Response.success(post, 'Post updated successfully');
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const post = await this.postsService.remove(id);
    return Response.success(post, 'Post deleted successfully');
  }
  @Patch(':id/mark-as-read')
  async markAsRead(@Param('id', ParseUUIDPipe) id: string) {
    await this.postsService.markAsRead(id);
    return Response.success(null, 'Post marked as read successfully');
  }
}
