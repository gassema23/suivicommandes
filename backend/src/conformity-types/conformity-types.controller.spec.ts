import { Test, TestingModule } from '@nestjs/testing';
import { ConformityTypesController } from './conformity-types.controller';

describe('ConformityTypesController', () => {
  let controller: ConformityTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConformityTypesController],
    }).compile();

    controller = module.get<ConformityTypesController>(ConformityTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
