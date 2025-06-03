import { Test, TestingModule } from '@nestjs/testing';
import { SubdivisionClientsService } from './subdivision-clients.service';

describe('SubdivisionClientsService', () => {
  let service: SubdivisionClientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubdivisionClientsService],
    }).compile();

    service = module.get<SubdivisionClientsService>(SubdivisionClientsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
