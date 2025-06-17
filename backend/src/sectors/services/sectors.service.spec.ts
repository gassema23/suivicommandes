import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { Sector } from '../entities/sectors.entity';
import { SectorsService } from './sectors.service';

const mockSector = {
  id: 'uuid-sector',
  sectorName: 'Test sector',
  sectorDescription: 'Description',
  services: [],
};

describe('SectorsService', () => {
  let service: SectorsService;
  let repo: Repository<Sector>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SectorsService,
        {
          provide: getRepositoryToken(Sector),
          useValue: {
            findAndCount: jest.fn().mockResolvedValue([[mockSector], 1]),
            find: jest.fn().mockResolvedValue([mockSector]),
            findOne: jest.fn(),
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn().mockImplementation((sector) => sector),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SectorsService>(SectorsService);
    repo = module.get<Repository<Sector>>(getRepositoryToken(Sector));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return paginated sectors', async () => {
    const result = await service.findAll({ page: 1, limit: 10 });
    expect(result.data).toEqual([mockSector]);
    expect(result.meta.total).toBe(1);
  });

  it('should create a sector', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    const dto = {
      sectorName: 'Test sector',
      sectorDescription: 'Description',
    };
    const created = await service.create(dto, 'user-sector');
    expect(created.sectorName).toBe('Test sector');
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if sector already exists on create', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockSector);
    await expect(
      service.create(
        {
          sectorName: 'Test sector',
          sectorDescription: 'Description',
        },
        'user-sector',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should find one sector', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockSector);
    const sector = await service.findOne('uuid-sector');
    expect(sector).toEqual(mockSector);
  });

  it('should throw if sector not found', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(service.findOne('not-exist')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should update a sector', async () => {
    (repo.findOne as jest.Mock)
      .mockResolvedValueOnce(mockSector) // findOne for findOne(id)
      .mockResolvedValueOnce(undefined); // findOne for duplicate check
    const updated = await service.update(
      'uuid-sector',
      {
        sectorName: 'New Name',
        sectorDescription: 'Description',
      },
      'user-sector',
    );
    expect(updated.sectorName).toBe('New Name');
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if updated sector name already exists', async () => {
    (repo.findOne as jest.Mock)
      .mockResolvedValueOnce(mockSector) // findOne for findOne(id)
      .mockResolvedValueOnce(mockSector); // findOne for duplicate check
    await expect(
      service.update(
        'uuid-sector',
        {
          sectorName: 'Test sector',
          sectorDescription: 'Description',
        },
        'user-sector',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should remove a sector', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce({
      ...mockSector,
      services: [],
    });
    await expect(
      service.remove('uuid-sector', 'user-sector'),
    ).resolves.toBeUndefined();
    expect(repo.save).toHaveBeenCalled();
    expect(repo.softDelete).toHaveBeenCalledWith('uuid-sector');
  });

  it('should throw if sector not found on remove', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(service.remove('not-exist', 'user-sector')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw if sector has services on remove', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce({
      ...mockSector,
      services: [{ id: 'service1' }],
    });
    await expect(service.remove('uuid-sector', 'user-sector')).rejects.toThrow(
      BadRequestException,
    );
  });
});
