import { Test, TestingModule } from '@nestjs/testing';
import { RequestTypeServiceCategoriesService } from './request-type-service-categories.service';

describe('RequestTypeServiceCategoriesService', () => {
  let service: RequestTypeServiceCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestTypeServiceCategoriesService],
    }).compile();

    service = module.get<RequestTypeServiceCategoriesService>(RequestTypeServiceCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
