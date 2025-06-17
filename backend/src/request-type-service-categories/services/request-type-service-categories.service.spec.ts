import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { RequestTypeServiceCategory } from '../entities/request-type-service-category.entity';
import { RequestTypeServiceCategoriesService } from './request-type-service-categories.service';
import { RequestType } from '../../request-types/entities/request-type.entity';
import { ServiceCategory } from '../../service-categories/entities/service-category.entity';

const mockRequestTypeServiceCategory = {
  id: 'uuid-request-type-service-category',
  availabilityDelay: 1,
  minimumRequiredDelay: 2,
  serviceActivationDelay: 3,
  requestType: { id: 'uuid-request-type', requestTypeName: 'Type A' },
  serviceCategory: {
    id: 'uuid-service-category',
    serviceCategoryName: 'Catégorie A',
  },
};

describe('RequestTypeServiceCategoriesService', () => {
  let service: RequestTypeServiceCategoriesService;
  let repo: Repository<RequestTypeServiceCategory>;
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
        .mockResolvedValue([[mockRequestTypeServiceCategory], 1]),
      getOne: jest.fn().mockResolvedValue(mockRequestTypeServiceCategory),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestTypeServiceCategoriesService,
        {
          provide: getRepositoryToken(RequestTypeServiceCategory),
          useValue: {
            findAndCount: jest
              .fn()
              .mockResolvedValue([[mockRequestTypeServiceCategory], 1]),
            find: jest.fn().mockResolvedValue([mockRequestTypeServiceCategory]),
            findOne: jest.fn(),
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn().mockImplementation((entity) => entity),
            softDelete: jest.fn(),
            createQueryBuilder: jest.fn(() => createQueryBuilderMock),
          },
        },
        {
          provide: getRepositoryToken(RequestType),
          useValue: {
            findOne: jest.fn().mockResolvedValue({
              id: 'uuid-request-type',
              requestTypeName: 'Type A',
            }),
          },
        },
        {
          provide: getRepositoryToken(ServiceCategory),
          useValue: {
            findOne: jest.fn().mockResolvedValue({
              id: 'uuid-service-category',
              serviceCategoryName: 'Catégorie A',
            }),
          },
        },
      ],
    }).compile();

    service = module.get<RequestTypeServiceCategoriesService>(
      RequestTypeServiceCategoriesService,
    );
    repo = module.get<Repository<RequestTypeServiceCategory>>(
      getRepositoryToken(RequestTypeServiceCategory),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return paginated request type service categories', async () => {
    const result = await service.findAll({ page: 1, limit: 10 });
    expect(result.data).toEqual([mockRequestTypeServiceCategory]);
    expect(result.meta.total).toBe(1);
  });

  it('should create a request type service category', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    const dto = {
      serviceCategoryId: 'uuid-service-category',
      requestTypeId: 'uuid-request-type',
      availabilityDelay: 1,
      minimumRequiredDelay: 2,
      serviceActivationDelay: 3,
    };
    const created = await service.create(dto, 'user-id');
    expect(created.serviceCategory.id).toBe('uuid-service-category');
    expect(created.requestType.id).toBe('uuid-request-type');
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if request type service category already exists on create', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(
      mockRequestTypeServiceCategory,
    );
    await expect(
      service.create(
        {
          serviceCategoryId: 'uuid-service-category',
          requestTypeId: 'uuid-request-type',
          availabilityDelay: 1,
        },
        'user-id',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should find one request type service category', async () => {
    createQueryBuilderMock.getOne.mockResolvedValueOnce(
      mockRequestTypeServiceCategory,
    );
    const entity = await service.findOne('uuid-request-type-service-category');
    expect(entity).toEqual(mockRequestTypeServiceCategory);
  });

  it('should throw if request type service category not found', async () => {
    createQueryBuilderMock.getOne.mockResolvedValueOnce(undefined);
    await expect(service.findOne('not-exist')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should update a request type service category', async () => {
    createQueryBuilderMock.getOne.mockResolvedValueOnce(
      mockRequestTypeServiceCategory,
    ); // findOne(id)
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined); // duplicate check
    const updated = await service.update(
      'uuid-request-type-service-category',
      {
        serviceCategoryId: 'uuid-service-category',
        requestTypeId: 'uuid-request-type',
        availabilityDelay: 2,
      },
      'user-id',
    );
    expect(updated.availabilityDelay).toBe(2);
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if updated request type service category already exists', async () => {
    createQueryBuilderMock.getOne.mockResolvedValueOnce(
      mockRequestTypeServiceCategory,
    ); // findOne(id)
    (repo.findOne as jest.Mock).mockResolvedValueOnce({
      ...mockRequestTypeServiceCategory,
      id: 'another-id',
    }); // duplicate check
    await expect(
      service.update(
        'uuid-request-type-service-category',
        {
          serviceCategoryId: 'uuid-service-category',
          requestTypeId: 'uuid-request-type',
          availabilityDelay: 2,
        },
        'user-id',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should remove a request type service category', async () => {
    createQueryBuilderMock.getOne.mockResolvedValueOnce(
      mockRequestTypeServiceCategory,
    );
    await expect(
      service.remove('uuid-request-type-service-category', 'user-id'),
    ).resolves.toBeUndefined();
    expect(repo.save).toHaveBeenCalled();
    expect(repo.softDelete).toHaveBeenCalledWith(
      'uuid-request-type-service-category',
    );
  });

  it('should throw if request type service category not found on remove', async () => {
    createQueryBuilderMock.getOne.mockResolvedValueOnce(undefined);
    await expect(service.remove('not-exist', 'user-id')).rejects.toThrow(
      BadRequestException,
    );
  });
});
