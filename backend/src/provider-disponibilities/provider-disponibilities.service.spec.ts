import { Test, TestingModule } from '@nestjs/testing';
import { ProviderDisponibilitiesService } from './provider-disponibilities.service';

describe('ProviderDisponibilitiesService', () => {
  let service: ProviderDisponibilitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProviderDisponibilitiesService],
    }).compile();

    service = module.get<ProviderDisponibilitiesService>(ProviderDisponibilitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
