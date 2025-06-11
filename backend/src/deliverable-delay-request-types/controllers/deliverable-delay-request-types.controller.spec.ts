import { Test, TestingModule } from '@nestjs/testing';
import { DeliverableDelayRequestTypesController } from './deliverable-delay-request-types.controller';

describe('DeliverableDelayRequestTypesController', () => {
  let controller: DeliverableDelayRequestTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliverableDelayRequestTypesController],
    }).compile();

    controller = module.get<DeliverableDelayRequestTypesController>(DeliverableDelayRequestTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
