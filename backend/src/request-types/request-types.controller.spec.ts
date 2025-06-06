import { Test, TestingModule } from '@nestjs/testing';
import { RequestTypesController } from './request-types.controller';

describe('RequestTypesController', () => {
  let controller: RequestTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestTypesController],
    }).compile();

    controller = module.get<RequestTypesController>(RequestTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
