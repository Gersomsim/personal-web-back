import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechStack } from './entities/tech-stack.entity';
import { TechStacksController } from './tech-stacks.controller';
import { TechStacksService } from './tech-stacks.service';

@Module({
  imports: [TypeOrmModule.forFeature([TechStack])],
  controllers: [TechStacksController],
  providers: [TechStacksService],
  exports: [TechStacksService],
})
export class TechStacksModule {}
