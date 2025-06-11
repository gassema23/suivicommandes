import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { DeliverableDelayRequestType } from '../entities/deliverable-delay-request-type.entity';
import { DeliverableDelayRequestTypesService } from './deliverable-delay-request-types.service';
import { RequestTypeServiceCategory } from '../../request-type-service-categories/entities/request-type-service-category.entity';
import { Deliverable } from '../../deliverables/entities/deliverable.entity';

const mockDeliverableDelayRequestType = {
  id: 'uuid-deliverable-delay-request-type',
  requestTypeServiceCategory: { id: 'uuid-rtsc' },
  deliverable: { id: 'uuid-deliverable' },
};

describe('DeliverableDelayRequestTypesService', () => {
  let service: DeliverableDelayRequestTypesService;
  let repo: Repository<DeliverableDelayRequestType>;
  let createQueryBuilderMock: any;

  beforeEach(async () => {
    createQueryBuilderMock = {
      leftJoin: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getRawAndEntities: jest.fn().mockResolvedValue({
        entities: [mockDeliverableDelayRequestType],
        raw: [mockDeliverableDelayRequestType],
      }),
      getOne: jest.fn().mockResolvedValue(mockDeliverableDelayRequestType),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliverableDelayRequestTypesService,
        {
          provide: getRepositoryToken(DeliverableDelayRequestType),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn().mockImplementation((dto) => ({
              ...dto,
              id: 'uuid-deliverable-delay-request-type',
              requestTypeServiceCategory: {
                id: dto.requestTypeServiceCategoryId,
              },
              deliverable: { id: dto.deliverableId },
            })),
            save: jest.fn().mockImplementation((entity) => entity), // <-- retourne bien l'entité
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
          provide: getRepositoryToken(Deliverable),
          useValue: {
            findOne: jest.fn().mockResolvedValue({ id: 'uuid-deliverable' }),
          },
        },
      ],
    }).compile();

    service = module.get<DeliverableDelayRequestTypesService>(
      DeliverableDelayRequestTypesService,
    );
    repo = module.get<Repository<DeliverableDelayRequestType>>(
      getRepositoryToken(DeliverableDelayRequestType),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return paginated deliverable delay request types', async () => {
    const result = await service.findAll({ page: 1, limit: 10 });
    expect(result.data).toEqual([mockDeliverableDelayRequestType]);
    expect(result.meta.total).toBe(1);
  });

  it('should create a deliverable delay request type', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    const dto = {
      requestTypeServiceCategoryId: 'uuid-rtsc',
      deliverableId: 'uuid-deliverable',
      delayValue: 5,
    };
    const created = await service.create(dto, 'user-id');
    expect(created.id).toBeDefined();
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if deliverable delay request type already exists on create', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(
      mockDeliverableDelayRequestType,
    );
    await expect(
      service.create(
        {
          requestTypeServiceCategoryId: 'uuid-rtsc',
          deliverableId: 'uuid-deliverable',
        },
        'user-id',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should find one deliverable delay request type', async () => {
    createQueryBuilderMock.getOne.mockResolvedValueOnce(
      mockDeliverableDelayRequestType,
    );
    const entity = await service.findOne('uuid-deliverable-delay-request-type');
    expect(entity).toEqual(mockDeliverableDelayRequestType);
  });

  it('should throw if deliverable delay request type not found', async () => {
    createQueryBuilderMock.getOne.mockResolvedValueOnce(undefined);
    await expect(service.findOne('not-exist')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should update a deliverable delay request type', async () => {
    createQueryBuilderMock.getOne.mockResolvedValueOnce(
      mockDeliverableDelayRequestType,
    ); // findOne(id)
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined); // duplicate check
    const updated = await service.update(
      'uuid-deliverable-delay-request-type',
      {
        requestTypeServiceCategoryId: 'uuid-rtsc',
        deliverableId: 'uuid-deliverable',
      },
      'user-id',
    );
    expect(updated.id).toBeDefined();
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if updated deliverable delay request type already exists', async () => {
    createQueryBuilderMock.getOne.mockResolvedValueOnce(
      mockDeliverableDelayRequestType,
    ); // findOne(id)
    (repo.findOne as jest.Mock).mockResolvedValueOnce({
      ...mockDeliverableDelayRequestType,
      id: 'another-id',
    }); // duplicate check
    await expect(
      service.update(
        'uuid-deliverable-delay-request-type',
        {
          requestTypeServiceCategoryId: 'uuid-rtsc',
          deliverableId: 'uuid-deliverable',
        },
        'user-id',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should remove a deliverable delay request type', async () => {
    createQueryBuilderMock.getOne.mockResolvedValueOnce(
      mockDeliverableDelayRequestType,
    );
    await expect(
      service.remove('uuid-deliverable-delay-request-type', 'user-id'),
    ).resolves.toBeUndefined();
    expect(repo.save).toHaveBeenCalled();
    expect(repo.softDelete).toHaveBeenCalledWith(
      'uuid-deliverable-delay-request-type',
    );
  });

  it('should throw if deliverable delay request type not found on remove', async () => {
    createQueryBuilderMock.getOne.mockResolvedValueOnce(undefined);
    await expect(service.remove('not-exist', 'user-id')).rejects.toThrow(
      BadRequestException,
    );
  });
});
