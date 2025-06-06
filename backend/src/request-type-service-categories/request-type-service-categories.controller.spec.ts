import { Test, TestingModule } from '@nestjs/testing';
import { RequestTypeServiceCategoriesController } from './request-type-service-categories.controller';

describe('RequestTypeServiceCategoriesController', () => {
  let controller: RequestTypeServiceCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestTypeServiceCategoriesController],
    }).compile();

    controller = module.get<RequestTypeServiceCategoriesController>(RequestTypeServiceCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
