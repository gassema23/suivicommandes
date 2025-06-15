import { Test, TestingModule } from '@nestjs/testing';
import { DeliverableDelayFlowsController } from './deliverable-delay-flows.controller';

describe('DeliverableDelayFlowsController', () => {
  let controller: DeliverableDelayFlowsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliverableDelayFlowsController],
    }).compile();

    controller = module.get<DeliverableDelayFlowsController>(DeliverableDelayFlowsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
