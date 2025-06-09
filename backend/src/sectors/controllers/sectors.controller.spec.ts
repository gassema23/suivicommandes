import { Test, TestingModule } from '@nestjs/testing';
import { APP_GUARD } from '@nestjs/core';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SectorsController } from './sectors.controller';
import { SectorsService } from '../services/sectors.service';

jest.mock('../../auth/guards/authorizations.guard', () => ({
  AuthorizationsGuard: { canActivate: () => true },
}));

describe('SectorsController', () => {
  let controller: SectorsController;
  let service: SectorsService;

  const userId = uuidv4();
  const uuid = uuidv4();

  const mockSector = {
    id: uuid,
    sectorName: 'Sector name',
    sectorDescription: 'Description',
    services: [],
  };

  const createDto = {
    sectorName: 'Sector name',
    sectorDescription: 'Description',
  };

  const paginatedResult = {
    data: [mockSector],
    meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockSector),
    findAll: jest.fn().mockResolvedValue(paginatedResult),
    findOne: jest.fn().mockResolvedValue(mockSector),
    update: jest.fn().mockResolvedValue({
      ...mockSector,
      sectorName: 'Updated',
    }),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SectorsController],
      providers: [
        { provide: SectorsService, useValue: mockService },
        { provide: APP_GUARD, useValue: { canActivate: () => true } },
      ],
    }).compile();

    controller = module.get<SectorsController>(SectorsController);
    service = module.get<SectorsService>(SectorsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a sector', async () => {
    expect(await controller.create(createDto, { id: userId } as any)).toEqual(
      mockSector,
    );
    expect(service.create).toHaveBeenCalledWith(createDto, userId);
  });

  it('should return all sectors', async () => {
    expect(await controller.findAll({})).toEqual({
      ...paginatedResult,
      data: paginatedResult.data.map(() => expect.any(Object)),
    });
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a sector by id', async () => {
    expect(await controller.findOne(uuid)).toEqual(mockSector);
    expect(service.findOne).toHaveBeenCalledWith(uuid);
  });

  it('should update a sector', async () => {
    expect(
      await controller.update(uuid, { sectorName: 'Updated' }, {
        id: userId,
      } as any),
    ).toEqual({
      ...mockSector,
      sectorName: 'Updated',
    });
    expect(service.update).toHaveBeenCalledWith(
      uuid,
      { sectorName: 'Updated' },
      userId,
    );
  });

  it('should remove a sector', async () => {
    expect(await controller.remove(uuid, { id: userId } as any)).toEqual({
      deleted: true,
    });
    expect(service.remove).toHaveBeenCalledWith(uuid, userId);
  });

  // Error handling tests
  it('should throw NotFoundException if sector not found', async () => {
    mockService.findOne.mockRejectedValueOnce(
      new NotFoundException('Not found'),
    );
    await expect(controller.findOne(uuidv4())).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw BadRequestException on invalid create', async () => {
    mockService.create.mockRejectedValueOnce(
      new BadRequestException('Invalid data'),
    );
    await expect(
      controller.create({ sectorName: '', sectorDescription: '' }, {
        id: userId,
      } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException on update if not found', async () => {
    mockService.update.mockRejectedValueOnce(
      new NotFoundException('Not found'),
    );
    await expect(
      controller.update(uuidv4(), { sectorName: 'X' }, {
        id: userId,
      } as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException on invalid update', async () => {
    mockService.update.mockRejectedValueOnce(
      new BadRequestException('Invalid data'),
    );
    await expect(
      controller.update(uuidv4(), { sectorName: '' }, {
        id: userId,
      } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException on remove if not found', async () => {
    mockService.remove.mockRejectedValueOnce(
      new NotFoundException('Not found'),
    );
    await expect(
      controller.remove(uuidv4(), { id: userId } as any),
    ).rejects.toThrow(NotFoundException);
  });
});
