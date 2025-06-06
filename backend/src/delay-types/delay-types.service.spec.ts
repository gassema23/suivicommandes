import { Test, TestingModule } from '@nestjs/testing';
import { DelayTypesService } from './delay-types.service';

describe('DelayTypesService', () => {
  let service: DelayTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DelayTypesService],
    }).compile();

    service = module.get<DelayTypesService>(DelayTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
