import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { RequestType } from '../entities/request-type.entity';
import { RequestTypesService } from './request-types.service';

const mockRequestType = {
  id: 'uuid-request-type',
  requestTypeName: 'Test type',
  requestTypeDescription: 'Description',
};

describe('RequestTypesService', () => {
  let service: RequestTypesService;
  let repo: Repository<RequestType>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestTypesService,
        {
          provide: getRepositoryToken(RequestType),
          useValue: {
            findAndCount: jest.fn().mockResolvedValue([[mockRequestType], 1]),
            find: jest.fn().mockResolvedValue([mockRequestType]),
            findOne: jest.fn(),
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn().mockImplementation((entity) => entity),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RequestTypesService>(RequestTypesService);
    repo = module.get<Repository<RequestType>>(getRepositoryToken(RequestType));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return paginated request types', async () => {
    const result = await service.findAll({ page: 1, limit: 10 });
    expect(result.data).toEqual([mockRequestType]);
    expect(result.meta.total).toBe(1);
  });

  it('should create a request type', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    const dto = {
      requestTypeName: 'Test type',
      requestTypeDescription: 'Description',
    };
    const created = await service.create(dto, 'user-id');
    expect(created.requestTypeName).toBe('Test type');
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if request type already exists on create', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockRequestType);
    await expect(
      service.create(
        {
          requestTypeName: 'Test type',
          requestTypeDescription: 'Description',
        },
        'user-id',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should find one request type', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockRequestType);
    const entity = await service.findOne('uuid-request-type');
    expect(entity).toEqual(mockRequestType);
  });

  it('should throw if request type not found', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(service.findOne('not-exist')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should update a request type', async () => {
    (repo.findOne as jest.Mock)
      .mockResolvedValueOnce(mockRequestType) // findOne for findOne(id)
      .mockResolvedValueOnce(undefined); // findOne for duplicate check
    const updated = await service.update(
      'uuid-request-type',
      {
        requestTypeName: 'New Name',
        requestTypeDescription: 'Description',
      },
      'user-id',
    );
    expect(updated.requestTypeName).toBe('New Name');
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if updated request type name already exists', async () => {
    (repo.findOne as jest.Mock)
      .mockResolvedValueOnce(mockRequestType) // findOne for findOne(id)
      .mockResolvedValueOnce(mockRequestType); // findOne for duplicate check
    await expect(
      service.update(
        'uuid-request-type',
        {
          requestTypeName: 'Test type',
          requestTypeDescription: 'Description',
        },
        'user-id',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should remove a request type', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockRequestType);
    await expect(
      service.remove('uuid-request-type', 'user-id'),
    ).resolves.toBeUndefined();
    expect(repo.save).toHaveBeenCalled();
    expect(repo.softDelete).toHaveBeenCalledWith('uuid-request-type');
  });

  it('should throw if request type not found on remove', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(service.remove('not-exist', 'user-id')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should not remove a request type if it has requestTypeServiceCategories', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce({
      ...mockRequestType,
      requestTypeServiceCategories: [{ id: 'cat-1' }],
    });
    await expect(
      service.remove('uuid-request-type', 'user-id'),
    ).rejects.toThrow(
      new BadRequestException(
        'Impossible de supprimer : ce type de demande est associé à au moins une catégorie de service.',
      ),
    );
  });
});
