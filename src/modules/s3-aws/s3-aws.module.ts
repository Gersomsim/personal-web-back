import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { S3AwsController } from './s3-aws.controller';
import { S3AwsService } from './s3-aws.service';
import { FilesService } from './services/files.service';

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  controllers: [S3AwsController],
  providers: [S3AwsService, FilesService],
  exports: [FilesService],
})
export class S3AwsModule {}
