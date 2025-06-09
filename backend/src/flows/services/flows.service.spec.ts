import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { FlowsService } from './flows.service';
import { Flow } from '../entities/flow.entity';

const mockFlow = {
  id: 'uuid-flow',
  flowName: 'Test flow',
  flowDescription: 'Description of test flow',
};

describe('FlowsService', () => {
  let service: FlowsService;
  let repo: Repository<Flow>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlowsService,
        {
          provide: getRepositoryToken(Flow),
          useValue: {
            findAndCount: jest.fn().mockResolvedValue([[mockFlow], 1]),
            find: jest.fn().mockResolvedValue([mockFlow]),
            findOne: jest.fn(),
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn().mockImplementation((flow) => flow),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FlowsService>(FlowsService);
    repo = module.get<Repository<Flow>>(getRepositoryToken(Flow));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return paginated flows', async () => {
    const result = await service.findAll({ page: 1, limit: 10 });
    expect(result.data).toEqual([mockFlow]);
    expect(result.meta.total).toBe(1);
  });

  it('should create a flow', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    const dto = {
      flowName: 'Test flow',
      flowDescription: 'Description of test flow',
    };
    const created = await service.create(dto, 'user-flow');
    expect(created.flowName).toBe('Test flow');
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if flow already exists on create', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockFlow);
    await expect(
      service.create(
        {
          flowName: 'Test flow',
          flowDescription: 'Description of test flow',
        },
        'user-flow',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should find one flow', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockFlow);
    const flow = await service.findOne('uuid-flow');
    expect(flow).toEqual(mockFlow);
  });

  it('should throw if flow not found', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(service.findOne('not-exist')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should update a flow', async () => {
    (repo.findOne as jest.Mock)
      .mockResolvedValueOnce(mockFlow) // findOne for findOne(id)
      .mockResolvedValueOnce(undefined); // findOne for duplicate check
    const updated = await service.update(
      'uuid-flow',
      { flowName: 'New Name', flowDescription: 'desc' },
      'user-flow',
    );
    expect(updated.flowName).toBe('New Name');
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if updated flow name already exists', async () => {
    (repo.findOne as jest.Mock)
      .mockResolvedValueOnce(mockFlow) // findOne for findOne(id)
      .mockResolvedValueOnce(mockFlow); // findOne for duplicate check
    await expect(
      service.update(
        'uuid-flow',
        { flowName: 'Test flow', flowDescription: 'desc' },
        'user-flow',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should remove a flow', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockFlow);
    await expect(
      service.remove('uuid-flow', 'user-flow'),
    ).resolves.toBeUndefined();
    expect(repo.save).toHaveBeenCalled();
    expect(repo.softDelete).toHaveBeenCalledWith('uuid-flow');
  });

  it('should throw if flow not found on remove', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(
      service.remove('not-exist', 'user-flow'),
    ).rejects.toThrow(BadRequestException);
  });
});