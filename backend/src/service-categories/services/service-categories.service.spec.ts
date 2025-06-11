import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { ServiceCategory } from '../entities/service-category.entity';
import { ServiceCategoriesService } from './service-categories.service';
import { Service } from '../../services/entities/service.entity';

const mockServiceCategory = {
  id: 'uuid-category',
  serviceCategoryName: 'Test category',
  serviceCategoryDescription: 'Description',
  service: { id: 'uuid-service' },
  providerServiceCategories: [],
};

describe('ServiceCategoriesService', () => {
  let service: ServiceCategoriesService;
  let repo: Repository<ServiceCategory>;
  let serviceRepo: Repository<Service>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceCategoriesService,
        {
          provide: getRepositoryToken(ServiceCategory),
          useValue: {
            findAndCount: jest
              .fn()
              .mockResolvedValue([[mockServiceCategory], 1]),
            find: jest.fn().mockResolvedValue([mockServiceCategory]),
            findOne: jest.fn(),
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn().mockImplementation((cat) => cat),
            softDelete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Service),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ServiceCategoriesService>(ServiceCategoriesService);
    repo = module.get<Repository<ServiceCategory>>(
      getRepositoryToken(ServiceCategory),
    );
    serviceRepo = module.get<Repository<Service>>(getRepositoryToken(Service));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return paginated service categories', async () => {
    const result = await service.findAll({ page: 1, limit: 10 });
    expect(result.data).toEqual([mockServiceCategory]);
    expect(result.meta.total).toBe(1);
  });

  it('should create a service category', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    (serviceRepo.findOne as jest.Mock).mockResolvedValueOnce({
      id: 'uuid-service',
    });
    const dto = {
      serviceCategoryName: 'Test category',
      serviceId: 'uuid-service',
      serviceCategoryDescription: 'Description',
    };
    const created = await service.create(dto, 'user-category');
    expect(created.serviceCategoryName).toBe('Test category');
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if service category already exists on create', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockServiceCategory);
    await expect(
      service.create(
        {
          serviceCategoryName: 'Test category',
          serviceId: 'uuid-service',
          serviceCategoryDescription: 'Description',
        },
        'user-category',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw if service not found on create', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    (serviceRepo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(
      service.create(
        {
          serviceCategoryName: 'Test category',
          serviceId: 'uuid-service',
          serviceCategoryDescription: 'Description',
        },
        'user-category',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should find one service category', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockServiceCategory);
    const category = await service.findOne('uuid-category');
    expect(category).toEqual(mockServiceCategory);
  });

  it('should throw if service category not found', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(service.findOne('not-exist')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should update a service category', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockServiceCategory);
    (serviceRepo.findOne as jest.Mock).mockResolvedValueOnce({
      id: 'uuid-service',
    });
    const updated = await service.update(
      'uuid-category',
      {
        serviceCategoryName: 'New Name',
        serviceId: 'uuid-service',
        serviceCategoryDescription: 'Description',
      },
      'user-category',
    );
    expect(updated.serviceCategoryName).toBe('New Name');
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if service not found on update', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockServiceCategory);
    (serviceRepo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(
      service.update(
        'uuid-category',
        {
          serviceCategoryName: 'New Name',
          serviceId: 'uuid-service',
          serviceCategoryDescription: 'Description',
        },
        'user-category',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should remove a service category', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce({
      ...mockServiceCategory,
      providerServiceCategories: [],
    });
    await expect(
      service.remove('uuid-category', 'user-category'),
    ).resolves.toBeUndefined();
    expect(repo.save).toHaveBeenCalled();
    expect(repo.softDelete).toHaveBeenCalledWith('uuid-category');
  });

  it('should throw if service category not found on remove', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(service.remove('not-exist', 'user-category')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw if service category has providers on remove', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce({
      ...mockServiceCategory,
      providerServiceCategories: [{ id: 'provider1' }],
    });
    await expect(
      service.remove('uuid-category', 'user-category'),
    ).rejects.toThrow(BadRequestException);
  });

  it('should return request types for a service category', async () => {
    const mockRequestType = { id: 'rt-1', name: 'Type 1' };
    const mockServiceCategoryWithRequestTypes = {
      ...mockServiceCategory,
      requestTypeServiceCategories: [
        { requestType: mockRequestType },
        { requestType: { id: 'rt-2', name: 'Type 2' } },
      ],
    };
    (repo.findOne as jest.Mock).mockResolvedValueOnce(
      mockServiceCategoryWithRequestTypes,
    );

    const result = await service.getRequestTypeServiceCategory('uuid-category');
    expect(result).toEqual([mockRequestType, { id: 'rt-2', name: 'Type 2' }]);
    expect(repo.findOne).toHaveBeenCalledWith({
      where: { id: 'uuid-category' },
      relations: [
        'requestTypeServiceCategories',
        'requestTypeServiceCategories.requestType',
      ],
    });
  });

  it('should throw if service category not found in getRequestTypeServiceCategory', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(
      service.getRequestTypeServiceCategory('not-exist'),
    ).rejects.toThrow(BadRequestException);
  });
});
