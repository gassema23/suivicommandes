import { Test, TestingModule } from '@nestjs/testing';
import { SubdivisionClientsController } from './subdivision-clients.controller';

describe('SubdivisionClientsController', () => {
  let controller: SubdivisionClientsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubdivisionClientsController],
    }).compile();

    controller = module.get<SubdivisionClientsController>(SubdivisionClientsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
