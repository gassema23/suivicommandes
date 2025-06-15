import { Test, TestingModule } from '@nestjs/testing';
import { DeliverableDelayFlowsService } from './deliverable-delay-flows.service';

describe('DeliverableDelayFlowsService', () => {
  let service: DeliverableDelayFlowsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliverableDelayFlowsService],
    }).compile();

    service = module.get<DeliverableDelayFlowsService>(DeliverableDelayFlowsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
