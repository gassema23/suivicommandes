import { Test, TestingModule } from '@nestjs/testing';
import { RequestTypeDelaysService } from './request-type-delays.service';

describe('RequestTypeDelaysService', () => {
  let service: RequestTypeDelaysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestTypeDelaysService],
    }).compile();

    service = module.get<RequestTypeDelaysService>(RequestTypeDelaysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
