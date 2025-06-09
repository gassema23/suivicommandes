import { Test, TestingModule } from '@nestjs/testing';
import { APP_GUARD } from '@nestjs/core';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from '../services/services.service';

jest.mock('../../auth/guards/authorizations.guard', () => ({
  AuthorizationsGuard: { canActivate: () => true },
}));

describe('ServicesController', () => {
  let controller: ServicesController;
  let service: ServicesService;

  const userId = uuidv4();
  const uuid = uuidv4();

  const mockServiceObj = {
    id: uuid,
    serviceName: 'Service name',
    sectorId: 'uuid-sector',
    serviceDescription: 'Description',
  };

  const createDto = {
    serviceName: 'Service name',
    sectorId: 'uuid-sector',
    serviceDescription: 'Description',
  };

  const updateDto = {
    serviceName: 'Updated',
    sectorId: 'uuid-sector',
    serviceDescription: 'Updated description',
  };

  const paginatedResult = {
    data: [mockServiceObj],
    meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockServiceObj),
    findAll: jest.fn().mockResolvedValue(paginatedResult),
    findOne: jest.fn().mockResolvedValue(mockServiceObj),
    update: jest.fn().mockResolvedValue({
      ...mockServiceObj,
      ...updateDto,
    }),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
    getServicesList: jest.fn().mockResolvedValue([mockServiceObj]),
    getServiceCategoriesByServiceId: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicesController],
      providers: [
        { provide: ServicesService, useValue: mockService },
        { provide: APP_GUARD, useValue: { canActivate: () => true } },
      ],
    }).compile();

    controller = module.get<ServicesController>(ServicesController);
    service = module.get<ServicesService>(ServicesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a service', async () => {
    expect(await controller.create(createDto, { id: userId } as any)).toEqual(
      mockServiceObj,
    );
    expect(service.create).toHaveBeenCalledWith(createDto, userId);
  });

  it('should return all services', async () => {
    expect(await controller.findAll({})).toEqual(paginatedResult);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a service by id', async () => {
    expect(await controller.findOne(uuid)).toEqual(mockServiceObj);
    expect(service.findOne).toHaveBeenCalledWith(uuid);
  });

  it('should update a service', async () => {
    expect(
      await controller.update(uuid, updateDto, {
        id: userId,
      } as any),
    ).toEqual({
      ...mockServiceObj,
      ...updateDto,
    });
    expect(service.update).toHaveBeenCalledWith(uuid, updateDto, userId);
  });

  it('should remove a service', async () => {
    expect(await controller.remove(uuid, { id: userId } as any)).toEqual({
      deleted: true,
    });
    expect(service.remove).toHaveBeenCalledWith(uuid, userId);
  });

  // Error handling tests
  it('should throw NotFoundException if service not found', async () => {
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
      controller.create(
        { serviceName: '', sectorId: '', serviceDescription: '' },
        {
          id: userId,
        } as any,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException on update if not found', async () => {
    mockService.update.mockRejectedValueOnce(
      new NotFoundException('Not found'),
    );
    await expect(
      controller.update(uuidv4(), { serviceName: 'X', sectorId: '' }, {
        id: userId,
      } as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException on invalid update', async () => {
    mockService.update.mockRejectedValueOnce(
      new BadRequestException('Invalid data'),
    );
    await expect(
      controller.update(uuidv4(), { serviceName: '', sectorId: '' }, {
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
