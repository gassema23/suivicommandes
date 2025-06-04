import { Test, TestingModule } from '@nestjs/testing';
import { ProviderServiceCategoriesService } from './provider-service-categories.service';

describe('ProviderServiceCategoriesService', () => {
  let service: ProviderServiceCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProviderServiceCategoriesService],
    }).compile();

    service = module.get<ProviderServiceCategoriesService>(ProviderServiceCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
