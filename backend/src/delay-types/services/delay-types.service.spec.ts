import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { DelayType } from '../entities/delay-type.entity';
import { DelayTypesService } from './delay-types.service';

const mockDelayType = {
  id: 'uuid-delay-type',
  delayTypeName: 'Test delay type',
  delayTypeDescription: 'Description of test delay type',
};

describe('DelayTypesService', () => {
  let service: DelayTypesService;
  let repo: Repository<DelayType>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DelayTypesService,
        {
          provide: getRepositoryToken(DelayType),
          useValue: {
            findAndCount: jest.fn().mockResolvedValue([[mockDelayType], 1]),
            find: jest.fn().mockResolvedValue([mockDelayType]),
            findOne: jest.fn(),
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn().mockImplementation((delayType) => delayType),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DelayTypesService>(DelayTypesService);
    repo = module.get<Repository<DelayType>>(getRepositoryToken(DelayType));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return paginated delay types', async () => {
    const result = await service.findAll({ page: 1, limit: 10 });
    expect(result.data).toEqual([mockDelayType]);
    expect(result.meta.total).toBe(1);
  });

  it('should create a delay type', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    const dto = { delayTypeName: 'Test delay type', delayTypeDescription: 'Description of test delay type' };
    const created = await service.create(dto, 'user-delay-type');
    expect(created.delayTypeName).toBe('Test delay type');
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if delay type already exists on create', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockDelayType);
    await expect(
      service.create({ delayTypeName: 'Test delay type', delayTypeDescription: 'Description of test delay type' }, 'user-delay-type'),
    ).rejects.toThrow(BadRequestException);
  });

  it('should find one delay type', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockDelayType);
    const delayType = await service.findOne('uuid-delay-type');
    expect(delayType).toEqual(mockDelayType);
  });

  it('should throw if delay type not found', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(service.findOne('not-exist')).rejects.toThrow(BadRequestException);
  });

  it('should update a delay type', async () => {
    (repo.findOne as jest.Mock)
      .mockResolvedValueOnce(mockDelayType) // findOne for findOne(id)
      .mockResolvedValueOnce(undefined); // findOne for duplicate check
    const updated = await service.update(
      'uuid-delay-type',
      { delayTypeName: 'New Name', delayTypeDescription: 'desc' },
      'user-delay-type',
    );
    expect(updated.delayTypeName).toBe('New Name');
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if updated delay type name already exists', async () => {
    (repo.findOne as jest.Mock)
      .mockResolvedValueOnce(mockDelayType) // findOne for findOne(id)
      .mockResolvedValueOnce(mockDelayType); // findOne for duplicate check
    await expect(
      service.update(
        'uuid-delay-type',
        { delayTypeName: 'Test delay type', delayTypeDescription: 'desc' },
        'user-delay-type',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should remove a delay type', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockDelayType);
    await expect(service.remove('uuid-delay-type', 'user-delay-type')).resolves.toBeUndefined();
    expect(repo.save).toHaveBeenCalled();
    expect(repo.softDelete).toHaveBeenCalledWith('uuid-delay-type');
  });

  it('should throw if delay type not found on remove', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(service.remove('not-exist', 'user-delay-type')).rejects.toThrow(BadRequestException);
  });
});