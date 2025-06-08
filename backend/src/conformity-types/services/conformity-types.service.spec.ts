import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { ConformityType } from '../entities/conformity-type.entity';
import { ConformityTypesService } from './conformity-types.service';

const mockConformityType = {
  id: 'uuid-conformity-type',
  conformityTypeName: 'Test Conformity type',
  conformityTypeDescription: 'Test description',
};

describe('ConformityTypesService', () => {
  let service: ConformityTypesService;
  let repo: Repository<ConformityType>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConformityTypesService,
        {
          provide: getRepositoryToken(ConformityType),
          useValue: {
            findAndCount: jest
              .fn()
              .mockResolvedValue([[mockConformityType], 1]),
            find: jest.fn().mockResolvedValue([mockConformityType]),
            findOne: jest.fn(),
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest
              .fn()
              .mockImplementation((conformityType) => conformityType),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ConformityTypesService>(ConformityTypesService);
    repo = module.get<Repository<ConformityType>>(
      getRepositoryToken(ConformityType),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return paginated conformity types', async () => {
    const result = await service.findAll({ page: 1, limit: 10 });
    expect(result.data).toEqual([mockConformityType]);
    expect(result.meta.total).toBe(1);
  });

  it('should create a conformity type', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    const dto = {
      conformityTypeName: 'Test Conformity type',
      conformityTypeDescription: 'Test description',
    };
    const created = await service.create(dto, 'user-uuid');
    expect(created.conformityTypeName).toBe('Test Conformity type');
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if conformity type already exists on create', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockConformityType);
    await expect(
      service.create(
        {
          conformityTypeName: 'Test Conformity type',
          conformityTypeDescription: 'Test description',
        },
        'user-uuid',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should find one conformity type', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockConformityType);
    const conformityType = await service.findOne('uuid-conformity-type');
    expect(conformityType).toEqual(mockConformityType);
  });

  it('should throw if conformity type not found', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(service.findOne('not-exist')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should update a conformity type', async () => {
    (repo.findOne as jest.Mock)
      .mockResolvedValueOnce(mockConformityType) // findOne for findOne(id)
      .mockResolvedValueOnce(undefined); // findOne for duplicate check
    const updated = await service.update(
      'uuid-conformity-type',
      { conformityTypeName: 'New Name', conformityTypeDescription: 'desc' },
      'user-uuid',
    );
    expect(updated.conformityTypeName).toBe('New Name');
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if updated conformity type name already exists', async () => {
    (repo.findOne as jest.Mock)
      .mockResolvedValueOnce(mockConformityType) // findOne for findOne(id)
      .mockResolvedValueOnce(mockConformityType); // findOne for duplicate check
    await expect(
      service.update(
        'uuid-conformity-type',
        {
          conformityTypeName: 'Test Conformity type',
          conformityTypeDescription: 'desc',
        },
        'user-uuid',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should remove a conformity type', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockConformityType);
    await expect(
      service.remove('uuid-conformity-type', 'user-uuid'),
    ).resolves.toBeUndefined();
    expect(repo.save).toHaveBeenCalled();
    expect(repo.softDelete).toHaveBeenCalledWith('uuid-conformity-type');
  });

  it('should throw if conformity type not found on remove', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(service.remove('not-exist', 'user-uuid')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should return empty data if no conformity types found', async () => {
    (repo.findAndCount as jest.Mock).mockResolvedValueOnce([[], 0]);
    const result = await service.findAll({ page: 1, limit: 10 });
    expect(result.data).toEqual([]);
    expect(result.meta.total).toBe(0);
  });

  it('should throw if repository throws unexpectedly', async () => {
    (repo.findAndCount as jest.Mock).mockRejectedValueOnce(
      new Error('DB error'),
    );
    await expect(service.findAll({ page: 1, limit: 10 })).rejects.toThrow(
      'DB error',
    );
  });

  it('should update only the description', async () => {
    (repo.findOne as jest.Mock)
      .mockResolvedValueOnce(mockConformityType)
      .mockResolvedValueOnce(undefined);
    const updated = await service.update(
      'uuid-conformity-type',
      { conformityTypeDescription: 'Nouvelle description' },
      'user-uuid',
    );
    expect(updated.conformityTypeDescription).toBe('Nouvelle description');
    expect(repo.save).toHaveBeenCalled();
  });
});
