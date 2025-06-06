import { Test, TestingModule } from '@nestjs/testing';
import { RequisitionTypesController } from './requisition-types.controller';

describe('RequisitionTypesController', () => {
  let controller: RequisitionTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequisitionTypesController],
    }).compile();

    controller = module.get<RequisitionTypesController>(RequisitionTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
