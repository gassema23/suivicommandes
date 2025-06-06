import { Test, TestingModule } from '@nestjs/testing';
import { ConformityTypesService } from './conformity-types.service';

describe('ConformityTypesService', () => {
  let service: ConformityTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConformityTypesService],
    }).compile();

    service = module.get<ConformityTypesService>(ConformityTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
