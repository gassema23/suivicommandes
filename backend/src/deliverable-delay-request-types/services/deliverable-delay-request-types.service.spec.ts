import { Test, TestingModule } from '@nestjs/testing';
import { DeliverableDelayRequestTypesService } from './deliverable-delay-request-types.service';

describe('DeliverableDelayRequestTypesService', () => {
  let service: DeliverableDelayRequestTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliverableDelayRequestTypesService],
    }).compile();

    service = module.get<DeliverableDelayRequestTypesService>(DeliverableDelayRequestTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
