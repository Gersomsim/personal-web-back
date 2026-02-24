import { Test, TestingModule } from '@nestjs/testing';
import { S3AwsController } from './s3-aws.controller';
import { S3AwsService } from './s3-aws.service';

describe('S3AwsController', () => {
  let controller: S3AwsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [S3AwsController],
      providers: [S3AwsService],
    }).compile();

    controller = module.get<S3AwsController>(S3AwsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
