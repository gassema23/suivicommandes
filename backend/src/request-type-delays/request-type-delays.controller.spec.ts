import { Test, TestingModule } from '@nestjs/testing';
import { RequestTypeDelaysController } from './request-type-delays.controller';

describe('RequestTypeDelaysController', () => {
  let controller: RequestTypeDelaysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestTypeDelaysController],
    }).compile();

    controller = module.get<RequestTypeDelaysController>(RequestTypeDelaysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
