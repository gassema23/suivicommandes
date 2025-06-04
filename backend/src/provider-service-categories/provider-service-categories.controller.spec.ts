import { Test, TestingModule } from '@nestjs/testing';
import { ProviderServiceCategoriesController } from './provider-service-categories.controller';

describe('ProviderServiceCategoriesController', () => {
  let controller: ProviderServiceCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProviderServiceCategoriesController],
    }).compile();

    controller = module.get<ProviderServiceCategoriesController>(ProviderServiceCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
