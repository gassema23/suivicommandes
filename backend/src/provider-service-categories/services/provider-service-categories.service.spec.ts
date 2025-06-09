import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { ProviderServiceCategory } from '../entities/provider-service-category.entity';
import { ProviderServiceCategoriesService } from './provider-service-categories.service';
import { Provider } from '../../providers/entities/provider.entity';
import { ServiceCategory } from '../../service-categories/entities/service-category.entity';

const mockProviderServiceCategory = {
  id: 'uuid-provider-service-category',
  provider: { id: 'uuid-provider' },
  serviceCategory: { id: 'uuid-service-category' },
};

describe('ProviderServiceCategoriesService', () => {
  let service: ProviderServiceCategoriesService;
  let repo: Repository<ProviderServiceCategory>;
  let createQueryBuilderMock: any;

  beforeEach(async () => {
    createQueryBuilderMock = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getManyAndCount: jest
        .fn()
        .mockResolvedValue([[mockProviderServiceCategory], 1]),
      getOne: jest.fn().mockResolvedValue(mockProviderServiceCategory),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProviderServiceCategoriesService,
        {
          provide: getRepositoryToken(ProviderServiceCategory),
          useValue: {
            findAndCount: jest
              .fn()
              .mockResolvedValue([[mockProviderServiceCategory], 1]),
            find: jest.fn().mockResolvedValue([mockProviderServiceCategory]),
            findOne: jest.fn(),
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest
              .fn()
              .mockImplementation(
                (providerServiceCategory) => providerServiceCategory,
              ),
            softDelete: jest.fn(),
            createQueryBuilder: jest.fn(() => createQueryBuilderMock),
          },
        },
        {
          provide: getRepositoryToken(Provider),
          useValue: {
            findOne: jest.fn().mockResolvedValue({ id: 'uuid-provider' }),
          },
        },
        {
          provide: getRepositoryToken(ServiceCategory),
          useValue: {
            findOne: jest
              .fn()
              .mockResolvedValue({ id: 'uuid-service-category' }),
          },
        },
      ],
    }).compile();

    service = module.get<ProviderServiceCategoriesService>(
      ProviderServiceCategoriesService,
    );
    repo = module.get<Repository<ProviderServiceCategory>>(
      getRepositoryToken(ProviderServiceCategory),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return paginated provider service categories', async () => {
    const result = await service.findAll({ page: 1, limit: 10 });
    expect(result.data).toEqual([mockProviderServiceCategory]);
    expect(result.meta.total).toBe(1);
  });

  it('should create a provider service category', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    const dto = {
      providerId: 'uuid-provider',
      serviceCategoryId: 'uuid-service-category',
    };
    const created = await service.create(dto, 'user-provider');
    expect(created.provider.id).toBe('uuid-provider');
    expect(created.serviceCategory.id).toBe('uuid-service-category');
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if provider service category already exists on create', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(
      mockProviderServiceCategory,
    );
    await expect(
      service.create(
        {
          providerId: 'uuid-provider',
          serviceCategoryId: 'uuid-service-category',
        },
        'user-provider',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should find one provider service category', async () => {
    // Simule le résultat trouvé via le query builder
    createQueryBuilderMock.getOne.mockResolvedValueOnce(
      mockProviderServiceCategory,
    );
    const providerServiceCategory = await service.findOne(
      'uuid-provider-service-category',
    );
    expect(providerServiceCategory).toEqual(mockProviderServiceCategory);
  });

  it('should throw if provider service category not found', async () => {
    // Simule le "not found" via le query builder
    createQueryBuilderMock.getOne.mockResolvedValueOnce(undefined);
    await expect(service.findOne('not-exist')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should update a provider service category', async () => {
    // Simule le résultat trouvé pour findOne(id)
    createQueryBuilderMock.getOne.mockResolvedValueOnce(
      mockProviderServiceCategory,
    );
    // Simule pas de doublon pour la vérification d'unicité
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    const updated = await service.update(
      'uuid-provider-service-category',
      {
        providerId: 'uuid-provider',
        serviceCategoryId: 'uuid-service-category',
      },
      'user-provider',
    );
    expect(updated.provider.id).toBe('uuid-provider');
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if updated provider service category already exists', async () => {
    // Simule le résultat trouvé pour findOne(id)
    createQueryBuilderMock.getOne.mockResolvedValueOnce(
      mockProviderServiceCategory,
    );
    // Simule un doublon pour la vérification d'unicité (id différent)
    (repo.findOne as jest.Mock).mockResolvedValueOnce({
      ...mockProviderServiceCategory,
      id: 'another-id', // <-- id différent pour simuler un vrai doublon
    });
    await expect(
      service.update(
        'uuid-provider-service-category',
        {
          providerId: 'uuid-provider',
          serviceCategoryId: 'uuid-service-category',
        },
        'user-provider',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should remove a provider service category', async () => {
    // Simule le résultat trouvé via le query builder
    createQueryBuilderMock.getOne.mockResolvedValueOnce(
      mockProviderServiceCategory,
    );
    await expect(
      service.remove('uuid-provider-service-category', 'user-provider'),
    ).resolves.toBeUndefined();
    expect(repo.save).toHaveBeenCalled();
    expect(repo.softDelete).toHaveBeenCalledWith(
      'uuid-provider-service-category',
    );
  });

  it('should throw if provider service category not found on remove', async () => {
    // Simule le "not found" via le query builder
    createQueryBuilderMock.getOne.mockResolvedValueOnce(undefined);
    await expect(service.remove('not-exist', 'user-provider')).rejects.toThrow(
      BadRequestException,
    );
  });
});
