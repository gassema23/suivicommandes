import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { ProviderDisponibility } from '../entities/provider-disponibility.entity';
import { ProviderDisponibilitiesService } from './provider-disponibilities.service';

const mockProviderDisponibility = {
  id: 'uuid-provider-disponibility',
  providerDisponibilityName: 'Test provider disponibility',
  providerDisponibilityDescription:
    'Description of test provider disponibility',
};

describe('ProviderDisponibilitiesService', () => {
  let service: ProviderDisponibilitiesService;
  let repo: Repository<ProviderDisponibility>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProviderDisponibilitiesService,
        {
          provide: getRepositoryToken(ProviderDisponibility),
          useValue: {
            findAndCount: jest
              .fn()
              .mockResolvedValue([[mockProviderDisponibility], 1]),
            find: jest.fn().mockResolvedValue([mockProviderDisponibility]),
            findOne: jest.fn(),
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest
              .fn()
              .mockImplementation(
                (providerDisponibility) => providerDisponibility,
              ),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProviderDisponibilitiesService>(
      ProviderDisponibilitiesService,
    );
    repo = module.get<Repository<ProviderDisponibility>>(
      getRepositoryToken(ProviderDisponibility),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return paginated provider disponibilities', async () => {
    const result = await service.findAll({ page: 1, limit: 10 });
    expect(result.data).toEqual([mockProviderDisponibility]);
    expect(result.meta.total).toBe(1);
  });

  it('should create a provider disponibility', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    const dto = {
      providerDisponibilityName: 'Test provider disponibility',
      providerDisponibilityDescription:
        'Description of test provider disponibility',
    };
    const created = await service.create(dto, 'user-provider');
    expect(created.providerDisponibilityName).toBe(
      'Test provider disponibility',
    );
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if provider disponibility already exists on create', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(
      mockProviderDisponibility,
    );
    await expect(
      service.create(
        {
          providerDisponibilityName: 'Test provider disponibility',
          providerDisponibilityDescription:
            'Description of test provider disponibility',
        },
        'user-provider',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should find one provider disponibility', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(
      mockProviderDisponibility,
    );
    const providerDisponibility = await service.findOne(
      'uuid-provider-disponibility',
    );
    expect(providerDisponibility).toEqual(mockProviderDisponibility);
  });

  it('should throw if provider disponibility not found', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(service.findOne('not-exist')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should update a provider disponibility', async () => {
    (repo.findOne as jest.Mock)
      .mockResolvedValueOnce(mockProviderDisponibility) // findOne for findOne(id)
      .mockResolvedValueOnce(undefined); // findOne for duplicate check
    const updated = await service.update(
      'uuid-provider-disponibility',
      {
        providerDisponibilityName: 'New Name',
        providerDisponibilityDescription: 'desc',
      },
      'user-provider',
    );
    expect(updated.providerDisponibilityName).toBe('New Name');
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if updated provider disponibility name already exists', async () => {
    (repo.findOne as jest.Mock)
      .mockResolvedValueOnce(mockProviderDisponibility) // findOne for findOne(id)
      .mockResolvedValueOnce(mockProviderDisponibility); // findOne for duplicate check
    await expect(
      service.update(
        'uuid-provider-disponibility',
        {
          providerDisponibilityName: 'Test provider disponibility',
          providerDisponibilityDescription: 'desc',
        },
        'user-provider',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should remove a provider disponibility', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(
      mockProviderDisponibility,
    );
    await expect(
      service.remove('uuid-provider-disponibility', 'user-provider'),
    ).resolves.toBeUndefined();
    expect(repo.save).toHaveBeenCalled();
    expect(repo.softDelete).toHaveBeenCalledWith('uuid-provider-disponibility');
  });

  it('should throw if provider disponibility not found on remove', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(service.remove('not-exist', 'user-provider')).rejects.toThrow(
      BadRequestException,
    );
  });
});
