import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { RequisitionType } from '../entities/requisition-type.entity';
import { RequisitionTypesService } from './requisition-types.service';

const mockRequisitionType = {
  id: 'uuid-requisition-type',
  requisitionTypeName: 'Test requisition',
  requisitionTypeDescription: 'Description of test requisition',
};

describe('RequisitionTypesService', () => {
  let service: RequisitionTypesService;
  let repo: Repository<RequisitionType>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequisitionTypesService,
        {
          provide: getRepositoryToken(RequisitionType),
          useValue: {
            findAndCount: jest
              .fn()
              .mockResolvedValue([[mockRequisitionType], 1]),
            find: jest.fn().mockResolvedValue([mockRequisitionType]),
            findOne: jest.fn(),
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn().mockImplementation((entity) => entity),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RequisitionTypesService>(RequisitionTypesService);
    repo = module.get<Repository<RequisitionType>>(
      getRepositoryToken(RequisitionType),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return paginated requisition types', async () => {
    const result = await service.findAll({ page: 1, limit: 10 });
    expect(result.data).toEqual([mockRequisitionType]);
    expect(result.meta.total).toBe(1);
  });

  it('should create a requisition type', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    const dto = {
      requisitionTypeName: 'Test requisition',
      requisitionTypeDescription: 'Description of test requisition',
    };
    const created = await service.create(dto, 'user-requisition');
    expect(created.requisitionTypeName).toBe('Test requisition');
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if requisition type already exists on create', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockRequisitionType);
    await expect(
      service.create(
        {
          requisitionTypeName: 'Test requisition',
          requisitionTypeDescription: 'Description of test requisition',
        },
        'user-requisition',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should find one requisition type', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockRequisitionType);
    const entity = await service.findOne('uuid-requisition-type');
    expect(entity).toEqual(mockRequisitionType);
  });

  it('should throw if requisition type not found', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(service.findOne('not-exist')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should update a requisition type', async () => {
    (repo.findOne as jest.Mock)
      .mockResolvedValueOnce(mockRequisitionType) // findOne for findOne(id)
      .mockResolvedValueOnce(undefined); // findOne for duplicate check
    const updated = await service.update(
      'uuid-requisition-type',
      {
        requisitionTypeName: 'New Name',
        requisitionTypeDescription: 'desc',
      },
      'user-requisition',
    );
    expect(updated.requisitionTypeName).toBe('New Name');
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if updated requisition type name already exists', async () => {
    (repo.findOne as jest.Mock)
      .mockResolvedValueOnce(mockRequisitionType) // findOne for findOne(id)
      .mockResolvedValueOnce(mockRequisitionType); // findOne for duplicate check
    await expect(
      service.update(
        'uuid-requisition-type',
        {
          requisitionTypeName: 'Test requisition',
          requisitionTypeDescription: 'desc',
        },
        'user-requisition',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should remove a requisition type', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockRequisitionType);
    await expect(
      service.remove('uuid-requisition-type', 'user-requisition'),
    ).resolves.toBeUndefined();
    expect(repo.save).toHaveBeenCalled();
    expect(repo.softDelete).toHaveBeenCalledWith('uuid-requisition-type');
  });

  it('should throw if requisition type not found on remove', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(
      service.remove('not-exist', 'user-requisition'),
    ).rejects.toThrow(BadRequestException);
  });
});
