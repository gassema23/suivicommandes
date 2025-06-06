import { Test, TestingModule } from '@nestjs/testing';
import { ProviderDisponibilitiesController } from './provider-disponibilities.controller';

describe('ProviderDisponibilitiesController', () => {
  let controller: ProviderDisponibilitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProviderDisponibilitiesController],
    }).compile();

    controller = module.get<ProviderDisponibilitiesController>(ProviderDisponibilitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
