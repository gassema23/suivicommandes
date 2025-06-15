import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { DeliverablesService } from './deliverables.service';
import { Deliverable } from '../entities/deliverable.entity';

const mockDeliverable = {
  id: 'uuid-deliverable',
  deliverableName: 'Test deliverable',
  deliverableDescription: 'Description of test deliverable',
};

describe('DeliverablesService', () => {
  let service: DeliverablesService;
  let repo: Repository<Deliverable>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliverablesService,
        {
          provide: getRepositoryToken(Deliverable),
          useValue: {
            findAndCount: jest.fn().mockResolvedValue([[mockDeliverable], 1]),
            find: jest.fn().mockResolvedValue([mockDeliverable]),
            findOne: jest.fn(),
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn().mockImplementation((deliverable) => deliverable),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DeliverablesService>(DeliverablesService);
    repo = module.get<Repository<Deliverable>>(getRepositoryToken(Deliverable));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return paginated deliverables', async () => {
    const result = await service.findAll({ page: 1, limit: 10 });
    expect(result.data).toEqual([mockDeliverable]);
    expect(result.meta.total).toBe(1);
  });

  it('should create a deliverable', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    const dto = {
      deliverableName: 'Test deliverable',
      deliverableDescription: 'Description of test deliverable',
    };
    const created = await service.create(dto, 'user-deliverable');
    expect(created.deliverableName).toBe('Test deliverable');
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if deliverable already exists on create', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockDeliverable);
    await expect(
      service.create(
        {
          deliverableName: 'Test deliverable',
          deliverableDescription: 'Description of test deliverable',
        },
        'user-deliverable',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should find one deliverable', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockDeliverable);
    const deliverable = await service.findOne('uuid-deliverable');
    expect(deliverable).toEqual(mockDeliverable);
  });

  it('should throw if deliverable not found', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(service.findOne('not-exist')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should update a deliverable', async () => {
    (repo.findOne as jest.Mock)
      .mockResolvedValueOnce(mockDeliverable) // findOne for findOne(id)
      .mockResolvedValueOnce(undefined); // findOne for duplicate check
    const updated = await service.update(
      'uuid-deliverable',
      { deliverableName: 'New Name', deliverableDescription: 'desc' },
      'user-deliverable',
    );
    expect(updated.deliverableName).toBe('New Name');
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if updated deliverable name already exists', async () => {
    (repo.findOne as jest.Mock)
      .mockResolvedValueOnce(mockDeliverable) // findOne for findOne(id)
      .mockResolvedValueOnce(mockDeliverable); // findOne for duplicate check
    await expect(
      service.update(
        'uuid-deliverable',
        { deliverableName: 'Test deliverable', deliverableDescription: 'desc' },
        'user-deliverable',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should remove a deliverable', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockDeliverable);
    await expect(
      service.remove('uuid-deliverable', 'user-deliverable'),
    ).resolves.toBeUndefined();
    expect(repo.save).toHaveBeenCalled();
    expect(repo.softDelete).toHaveBeenCalledWith('uuid-deliverable');
  });

  it('should throw if deliverable not found on remove', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(
      service.remove('not-exist', 'user-deliverable'),
    ).rejects.toThrow(BadRequestException);
  });
});
