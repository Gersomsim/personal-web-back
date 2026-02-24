import { Test, TestingModule } from '@nestjs/testing';
import { S3AwsService } from './s3-aws.service';

describe('S3AwsService', () => {
  let service: S3AwsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [S3AwsService],
    }).compile();

    service = module.get<S3AwsService>(S3AwsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
