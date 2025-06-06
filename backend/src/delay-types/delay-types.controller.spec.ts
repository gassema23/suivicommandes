import { Test, TestingModule } from '@nestjs/testing';
import { DelayTypesController } from './delay-types.controller';

describe('DelayTypesController', () => {
  let controller: DelayTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DelayTypesController],
    }).compile();

    controller = module.get<DelayTypesController>(DelayTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
