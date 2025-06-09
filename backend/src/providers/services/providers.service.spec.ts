import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { Provider } from '../entities/provider.entity';
import { ProvidersService } from './providers.service';

const mockProvider = {
  id: 'uuid-provider',
  providerName: 'Test provider',
  providerCode: '6000',
  providerServiceCategories: [],
};

describe('ProvidersService', () => {
  let service: ProvidersService;
  let repo: Repository<Provider>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProvidersService,
        {
          provide: getRepositoryToken(Provider),
          useValue: {
            findAndCount: jest.fn().mockResolvedValue([[mockProvider], 1]),
            find: jest.fn().mockResolvedValue([mockProvider]),
            findOne: jest.fn(),
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn().mockImplementation((provider) => provider),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProvidersService>(ProvidersService);
    repo = module.get<Repository<Provider>>(getRepositoryToken(Provider));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return paginated providers', async () => {
    const result = await service.findAll({ page: 1, limit: 10 });
    expect(result.data).toEqual([mockProvider]);
    expect(result.meta.total).toBe(1);
  });

  it('should create a provider', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    const dto = {
      providerName: 'Test provider',
      providerCode: '6000',
    };
    const created = await service.create(dto, 'user-provider');
    expect(created.providerName).toBe('Test provider');
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if provider already exists on create', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockProvider);
    await expect(
      service.create(
        {
          providerName: 'Test provider',
          providerCode: '6000',
        },
        'user-provider',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should find one provider', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockProvider);
    const provider = await service.findOne('uuid-provider');
    expect(provider).toEqual(mockProvider);
  });

  it('should throw if provider not found', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(service.findOne('not-exist')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should update a provider', async () => {
    (repo.findOne as jest.Mock)
      .mockResolvedValueOnce(mockProvider) // findOne for findOne(id)
      .mockResolvedValueOnce(undefined); // findOne for duplicate check
    const updated = await service.update(
      'uuid-provider',
      {
        providerName: 'New Name',
        providerCode: '6000',
      },
      'user-provider',
    );
    expect(updated.providerName).toBe('New Name');
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if updated provider name/code already exists', async () => {
    (repo.findOne as jest.Mock)
      .mockResolvedValueOnce(mockProvider) // findOne for findOne(id)
      .mockResolvedValueOnce(mockProvider); // findOne for duplicate check
    await expect(
      service.update(
        'uuid-provider',
        {
          providerName: 'Test provider',
          providerCode: '6000',
        },
        'user-provider',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should remove a provider', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce({
      ...mockProvider,
      providerServiceCategories: [],
    });
    await expect(
      service.remove('uuid-provider', 'user-provider'),
    ).resolves.toBeUndefined();
    expect(repo.save).toHaveBeenCalled();
    expect(repo.softDelete).toHaveBeenCalledWith('uuid-provider');
  });

  it('should throw if provider not found on remove', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(service.remove('not-exist', 'user-provider')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw if provider has service categories on remove', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce({
      ...mockProvider,
      providerServiceCategories: [{ id: 'cat1' }],
    });
    await expect(
      service.remove('uuid-provider', 'user-provider'),
    ).rejects.toThrow(BadRequestException);
  });
});