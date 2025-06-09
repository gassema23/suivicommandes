import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { RequestTypeDelay } from '../entities/request-type-delay.entity';
import { RequestTypeDelaysService } from './request-type-delays.service';
import { RequestTypeServiceCategory } from '../../request-type-service-categories/entities/request-type-service-category.entity';
import { DelayType } from '../../delay-types/entities/delay-type.entity';

const mockRequestTypeDelay = {
  id: 'uuid-request-type-delay',
  delayValue: 5,
  requestTypeServiceCategory: { id: 'uuid-rtsc' },
  delayType: { id: 'uuid-delay-type' },
};

describe('RequestTypeDelaysService', () => {
  let service: RequestTypeDelaysService;
  let repo: Repository<RequestTypeDelay>;
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
      getManyAndCount: jest.fn().mockResolvedValue([[mockRequestTypeDelay], 1]),
      getOne: jest.fn().mockResolvedValue(mockRequestTypeDelay),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestTypeDelaysService,
        {
          provide: getRepositoryToken(RequestTypeDelay),
          useValue: {
            findAndCount: jest
              .fn()
              .mockResolvedValue([[mockRequestTypeDelay], 1]),
            find: jest.fn().mockResolvedValue([mockRequestTypeDelay]),
            findOne: jest.fn(),
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn().mockImplementation((entity) => entity),
            softDelete: jest.fn(),
            createQueryBuilder: jest.fn(() => createQueryBuilderMock),
          },
        },
        {
          provide: getRepositoryToken(RequestTypeServiceCategory),
          useValue: {
            findOne: jest.fn().mockResolvedValue({ id: 'uuid-rtsc' }),
          },
        },
        {
          provide: getRepositoryToken(DelayType),
          useValue: {
            findOne: jest.fn().mockResolvedValue({ id: 'uuid-delay-type' }),
          },
        },
      ],
    }).compile();

    service = module.get<RequestTypeDelaysService>(RequestTypeDelaysService);
    repo = module.get<Repository<RequestTypeDelay>>(
      getRepositoryToken(RequestTypeDelay),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return paginated request type delays', async () => {
    const result = await service.findAll({ page: 1, limit: 10 });
    expect(result.data).toEqual([mockRequestTypeDelay]);
    expect(result.meta.total).toBe(1);
  });

  it('should create a request type delay', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    const dto = {
      requestTypeServiceCategoryId: 'uuid-rtsc',
      delayTypeId: 'uuid-delay-type',
      delayValue: 5,
    };
    const created = await service.create(dto, 'user-id');
    expect(created.delayValue).toBe(5);
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if request type delay already exists on create', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockRequestTypeDelay);
    await expect(
      service.create(
        {
          requestTypeServiceCategoryId: 'uuid-rtsc',
          delayTypeId: 'uuid-delay-type',
          delayValue: 5,
        },
        'user-id',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should find one request type delay', async () => {
    createQueryBuilderMock.getOne.mockResolvedValueOnce(mockRequestTypeDelay);
    const entity = await service.findOne('uuid-request-type-delay');
    expect(entity).toEqual(mockRequestTypeDelay);
  });

  it('should throw if request type delay not found', async () => {
    createQueryBuilderMock.getOne.mockResolvedValueOnce(undefined);
    await expect(service.findOne('not-exist')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should update a request type delay', async () => {
    createQueryBuilderMock.getOne.mockResolvedValueOnce(mockRequestTypeDelay); // findOne(id)
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined); // duplicate check
    const updated = await service.update(
      'uuid-request-type-delay',
      {
        requestTypeServiceCategoryId: 'uuid-rtsc',
        delayTypeId: 'uuid-delay-type',
        delayValue: 10,
      },
      'user-id',
    );
    expect(updated.delayValue).toBe(10);
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if updated request type delay already exists', async () => {
    createQueryBuilderMock.getOne.mockResolvedValueOnce(mockRequestTypeDelay); // findOne(id)
    (repo.findOne as jest.Mock).mockResolvedValueOnce({
      ...mockRequestTypeDelay,
      id: 'another-id',
    }); // duplicate check
    await expect(
      service.update(
        'uuid-request-type-delay',
        {
          requestTypeServiceCategoryId: 'uuid-rtsc',
          delayTypeId: 'uuid-delay-type',
          delayValue: 10,
        },
        'user-id',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should remove a request type delay', async () => {
    createQueryBuilderMock.getOne.mockResolvedValueOnce(mockRequestTypeDelay);
    await expect(
      service.remove('uuid-request-type-delay', 'user-id'),
    ).resolves.toBeUndefined();
    expect(repo.save).toHaveBeenCalled();
    expect(repo.softDelete).toHaveBeenCalledWith('uuid-request-type-delay');
  });

  it('should throw if request type delay not found on remove', async () => {
    createQueryBuilderMock.getOne.mockResolvedValueOnce(undefined);
    await expect(service.remove('not-exist', 'user-id')).rejects.toThrow(
      BadRequestException,
    );
  });
});
