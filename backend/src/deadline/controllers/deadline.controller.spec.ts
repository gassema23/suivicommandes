import { Test, TestingModule } from '@nestjs/testing';
import { DeadlineController } from './deadline.controller';

describe('DeadlineController', () => {
  let controller: DeadlineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeadlineController],
    }).compile();

    controller = module.get<DeadlineController>(DeadlineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
