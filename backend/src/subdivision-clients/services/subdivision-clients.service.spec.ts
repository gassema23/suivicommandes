import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SubdivisionClient } from '../entities/subdivision-client.entity';
import { SubdivisionClientsService } from './subdivision-clients.service';
import { Client } from '../../clients/entities/client.entity';

const mockSubdivision = {
  id: 'uuid-subdivision',
  subdivisionClientName: 'Subdivision name',
  subdivisionClientNumber: '3000',
  client: { id: 'uuid-client' },
};

describe('SubdivisionClientsService', () => {
  let service: SubdivisionClientsService;
  let repo: Repository<SubdivisionClient>;
  let clientRepo: Repository<Client>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubdivisionClientsService,
        {
          provide: getRepositoryToken(SubdivisionClient),
          useValue: {
            findAndCount: jest.fn().mockResolvedValue([[mockSubdivision], 1]),
            find: jest.fn().mockResolvedValue([mockSubdivision]),
            findOne: jest.fn(),
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn().mockImplementation((sub) => sub),
            softDelete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Client),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SubdivisionClientsService>(SubdivisionClientsService);
    repo = module.get<Repository<SubdivisionClient>>(
      getRepositoryToken(SubdivisionClient),
    );
    clientRepo = module.get<Repository<Client>>(getRepositoryToken(Client));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return paginated subdivision clients', async () => {
    const result = await service.findAll({ page: 1, limit: 10 });
    expect(result.data).toEqual([mockSubdivision]);
    expect(result.meta.total).toBe(1);
  });

  it('should create a subdivision client', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    (clientRepo.findOne as jest.Mock).mockResolvedValueOnce({
      id: 'uuid-client',
    });
    const dto = {
      subdivisionClientName: 'Subdivision name',
      subdivisionClientNumber: '3000',
      clientId: 'uuid-client',
    };
    const created = await service.create(dto, 'user-subdivision');
    expect(created.subdivisionClientName).toBe('Subdivision name');
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if subdivision client already exists on create', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockSubdivision);
    await expect(
      service.create(
        {
          subdivisionClientName: 'Subdivision name',
          subdivisionClientNumber: '3000',
          clientId: 'uuid-client',
        },
        'user-subdivision',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should find one subdivision client', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockSubdivision);
    const subdivision = await service.findOne('uuid-subdivision');
    expect(subdivision).toEqual(mockSubdivision);
  });

  it('should throw if subdivision client not found', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(service.findOne('not-exist')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update a subdivision client', async () => {
    (repo.findOne as jest.Mock)
      .mockResolvedValueOnce(mockSubdivision) // findOne for findOne(id)
      .mockResolvedValueOnce(undefined); // findOne for duplicate check
    const updated = await service.update(
      'uuid-subdivision',
      {
        subdivisionClientName: 'New Name',
        subdivisionClientNumber: '3001',
        clientId: 'uuid-client',
      },
      'user-subdivision',
    );
    expect(updated.subdivisionClientName).toBe('New Name');
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if updated subdivision client name already exists', async () => {
    (repo.findOne as jest.Mock)
      .mockResolvedValueOnce(mockSubdivision) // findOne for findOne(id)
      .mockResolvedValueOnce(mockSubdivision); // findOne for duplicate check
    await expect(
      service.update(
        'uuid-subdivision',
        {
          subdivisionClientName: 'Subdivision name',
          subdivisionClientNumber: '3000',
          clientId: 'uuid-client',
        },
        'user-subdivision',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should remove a subdivision client', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockSubdivision);
    await expect(
      service.remove('uuid-subdivision', 'user-subdivision'),
    ).resolves.toBeUndefined();
    expect(repo.save).toHaveBeenCalled();
    expect(repo.softDelete).toHaveBeenCalledWith('uuid-subdivision');
  });

  it('should throw if subdivision client not found on remove', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(
      service.remove('not-exist', 'user-subdivision'),
    ).rejects.toThrow(NotFoundException);
  });
});
