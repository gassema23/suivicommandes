import { Test, TestingModule } from '@nestjs/testing';
import { DeadlineService } from './deadline.service';

describe('DeadlineService', () => {
  let service: DeadlineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeadlineService],
    }).compile();

    service = module.get<DeadlineService>(DeadlineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
