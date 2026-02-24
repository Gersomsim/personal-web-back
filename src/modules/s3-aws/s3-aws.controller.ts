import {
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from 'src/core/decorators';
import { Role } from 'src/core/enums';
import { Response } from 'src/core/utils';
import { S3AwsService } from './s3-aws.service';

@Controller('files')
@Auth(Role.ADMIN)
export class S3AwsController {
  constructor(private readonly s3AwsService: S3AwsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const response = await this.s3AwsService.uploadFile(file);
    return Response.success(response, 'File uploaded successfully');
  }

  @Delete('delete/:fileKey')
  async deleteFile(@Param('fileKey') fileKey: string) {
    const response = await this.s3AwsService.deleteFile(fileKey);
    return Response.success(response, 'File deleted successfully');
  }
}
