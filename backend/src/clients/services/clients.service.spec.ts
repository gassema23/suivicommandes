import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from './clients.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Client } from '../entities/client.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

const mockClient = {
  id: 'uuid-client',
  clientName: 'Test Client',
  clientNumber: '6000',
  subdivisionClients: [],
};

describe('ClientsService', () => {
  let service: ClientsService;
  let repo: Repository<Client>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: getRepositoryToken(Client),
          useValue: {
            findAndCount: jest.fn().mockResolvedValue([[mockClient], 1]),
            find: jest.fn().mockResolvedValue([mockClient]),
            findOne: jest.fn(),
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn().mockImplementation((client) => client),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    repo = module.get<Repository<Client>>(getRepositoryToken(Client));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return paginated clients', async () => {
    const result = await service.findAll({ page: 1, limit: 10 });
    expect(result.data).toEqual([mockClient]);
    expect(result.meta.total).toBe(1);
  });

  it('should return clients list', async () => {
    const result = await service.getClientsList();
    expect(result).toEqual([mockClient]);
  });

  it('should create a client', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    const dto = { clientName: 'Test Client', clientNumber: '6000' };
    const created = await service.create(dto, 'user-uuid');
    expect(created.clientName).toBe('Test Client');
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if client already exists on create', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockClient);
    await expect(
      service.create(
        { clientName: 'Test Client', clientNumber: '6000' },
        'user-uuid',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should find one client', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockClient);
    const client = await service.findOne('uuid-client');
    expect(client).toEqual(mockClient);
  });

  it('should throw if client not found', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(service.findOne('not-exist')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should update a client', async () => {
    (repo.findOne as jest.Mock)
      .mockResolvedValueOnce(mockClient) // findOne for findOne(id)
      .mockResolvedValueOnce(undefined); // findOne for duplicate check
    const updated = await service.update(
      'uuid-client',
      { clientName: 'New Name', clientNumber: '6000' },
      'user-uuid',
    );
    expect(updated.clientName).toBe('New Name');
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if updated client name already exists', async () => {
    (repo.findOne as jest.Mock)
      .mockResolvedValueOnce(mockClient) // findOne for findOne(id)
      .mockResolvedValueOnce(mockClient); // findOne for duplicate check
    await expect(
      service.update(
        'uuid-client',
        { clientName: 'Test Client', clientNumber: '6000' },
        'user-uuid',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should remove a client', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce({
      ...mockClient,
      subdivisionClients: [],
    });
    await expect(
      service.remove('uuid-client', 'user-uuid'),
    ).resolves.toBeUndefined();
    expect(repo.save).toHaveBeenCalled();
    expect(repo.softDelete).toHaveBeenCalledWith('uuid-client');
  });

  it('should throw if client not found on remove', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(service.remove('not-exist', 'user-uuid')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw if client has subdivisions on remove', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce({
      ...mockClient,
      subdivisionClients: [{ id: 'sub-1' }],
    });
    await expect(service.remove('uuid-client', 'user-uuid')).rejects.toThrow(
      BadRequestException,
    );
  });
});
