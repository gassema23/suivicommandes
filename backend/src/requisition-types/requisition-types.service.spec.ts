import { Test, TestingModule } from '@nestjs/testing';
import { RequisitionTypesService } from './requisition-types.service';

describe('RequisitionTypesService', () => {
  let service: RequisitionTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequisitionTypesService],
    }).compile();

    service = module.get<RequisitionTypesService>(RequisitionTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
