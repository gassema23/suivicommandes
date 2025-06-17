import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { Service } from '../entities/service.entity';
import { ServicesService } from './services.service';
import { Sector } from '../../sectors/entities/sectors.entity';

const mockService = {
  id: 'uuid-service',
  serviceName: 'Test service',
  serviceDescription: 'Description',
  sector: { id: 'uuid-sector' },
  serviceCategories: [],
};

describe('ServicesService', () => {
  let service: ServicesService;
  let repo: Repository<Service>;
  let sectorRepo: Repository<Sector>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        {
          provide: getRepositoryToken(Service),
          useValue: {
            findAndCount: jest.fn().mockResolvedValue([[mockService], 1]),
            find: jest.fn().mockResolvedValue([mockService]),
            findOne: jest.fn(),
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn().mockImplementation((svc) => svc),
            softDelete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Sector),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
    repo = module.get<Repository<Service>>(getRepositoryToken(Service));
    sectorRepo = module.get<Repository<Sector>>(getRepositoryToken(Sector));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return paginated services', async () => {
    const result = await service.findAll({ page: 1, limit: 10 });
    expect(result.data).toEqual([mockService]);
    expect(result.meta.total).toBe(1);
  });

  it('should create a service', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    (sectorRepo.findOne as jest.Mock).mockResolvedValueOnce({
      id: 'uuid-sector',
    });
    const dto = {
      serviceName: 'Test service',
      sectorId: 'uuid-sector',
      serviceDescription: 'Description',
    };
    const created = await service.create(dto, 'user-service');
    expect(created.serviceName).toBe('Test service');
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if service already exists on create', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockService);
    await expect(
      service.create(
        {
          serviceName: 'Test service',
          sectorId: 'uuid-sector',
          serviceDescription: 'Description',
        },
        'user-service',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw if sector not found on create', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    (sectorRepo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(
      service.create(
        {
          serviceName: 'Test service',
          sectorId: 'uuid-sector',
          serviceDescription: 'Description',
        },
        'user-service',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should find one service', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockService);
    const svc = await service.findOne('uuid-service');
    expect(svc).toEqual(mockService);
  });

  it('should throw if service not found', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(service.findOne('not-exist')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should update a service', async () => {
    (repo.findOne as jest.Mock)
      .mockResolvedValueOnce(mockService) // findOne for findOne(id)
      .mockResolvedValueOnce(undefined); // findOne for duplicate check
    (sectorRepo.findOne as jest.Mock).mockResolvedValueOnce({
      id: 'uuid-sector',
    });
    const updated = await service.update(
      'uuid-service',
      {
        serviceName: 'New Name',
        sectorId: 'uuid-sector',
        serviceDescription: 'Description',
      },
      'user-service',
    );
    expect(updated.serviceName).toBe('New Name');
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if updated service name already exists', async () => {
    (repo.findOne as jest.Mock)
      .mockResolvedValueOnce(mockService) // findOne for findOne(id)
      .mockResolvedValueOnce(mockService); // findOne for duplicate check
    await expect(
      service.update(
        'uuid-service',
        {
          serviceName: 'Test service',
          sectorId: 'uuid-sector',
          serviceDescription: 'Description',
        },
        'user-service',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw if sector not found on update', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockService);
    (sectorRepo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(
      service.update(
        'uuid-service',
        {
          serviceName: 'New Name',
          sectorId: 'uuid-sector',
          serviceDescription: 'Description',
        },
        'user-service',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should remove a service', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce({
      ...mockService,
      serviceCategories: [],
    });
    await expect(
      service.remove('uuid-service', 'user-service'),
    ).resolves.toBeUndefined();
    expect(repo.save).toHaveBeenCalled();
    expect(repo.softDelete).toHaveBeenCalledWith('uuid-service');
  });

  it('should throw if service not found on remove', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(service.remove('not-exist', 'user-service')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw if service has categories on remove', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce({
      ...mockService,
      serviceCategories: [{ id: 'cat1' }],
    });
    await expect(
      service.remove('uuid-service', 'user-service'),
    ).rejects.toThrow(BadRequestException);
  });
});
