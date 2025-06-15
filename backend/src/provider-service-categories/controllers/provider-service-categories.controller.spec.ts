import { Test, TestingModule } from '@nestjs/testing';
import { APP_GUARD } from '@nestjs/core';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ProviderServiceCategoriesController } from './provider-service-categories.controller';
import { ProviderServiceCategoriesService } from '../services/provider-service-categories.service';

jest.mock('../../auth/guards/authorizations.guard', () => ({
  AuthorizationsGuard: { canActivate: () => true },
}));

describe('ProviderServiceCategoriesController', () => {
  let controller: ProviderServiceCategoriesController;
  let service: ProviderServiceCategoriesService;

  const userId = uuidv4();
  const uuid = uuidv4();

  const mockCategory = {
    id: uuid,
    providerId: uuidv4(),
    serviceCategoryId: uuidv4(),
  };

  const createDto = {
    providerId: uuidv4(),
    serviceCategoryId: uuidv4(),
  };

  const paginatedResult = {
    data: [mockCategory],
    meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockCategory),
    findAll: jest.fn().mockResolvedValue(paginatedResult),
    findOne: jest.fn().mockResolvedValue(mockCategory),
    update: jest.fn().mockResolvedValue({
      ...mockCategory,
      providerId: uuidv4(),
    }),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProviderServiceCategoriesController],
      providers: [
        { provide: ProviderServiceCategoriesService, useValue: mockService },
        { provide: APP_GUARD, useValue: { canActivate: () => true } },
      ],
    }).compile();

    controller = module.get<ProviderServiceCategoriesController>(
      ProviderServiceCategoriesController,
    );
    service = module.get<ProviderServiceCategoriesService>(
      ProviderServiceCategoriesService,
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a provider service category', async () => {
    expect(await controller.create(createDto, { id: userId } as any)).toEqual(
      mockCategory,
    );
    expect(service.create).toHaveBeenCalledWith(createDto, userId);
  });

  it('should return all provider service categories', async () => {
    expect(await controller.findAll({})).toEqual({
      ...paginatedResult,
      data: paginatedResult.data.map(() => expect.any(Object)),
    });
  });

  it('should return a provider service category by id', async () => {
    expect(await controller.findOne(uuid)).toEqual(mockCategory);
    expect(service.findOne).toHaveBeenCalledWith(uuid);
  });

  it('should update a provider service category', async () => {
    expect(
      await controller.update(
        uuid,
        { providerId: uuidv4(), serviceCategoryId: uuidv4() },
        {
          id: userId,
        } as any,
      ),
    ).toEqual({
      ...mockCategory,
      providerId: expect.any(String),
      serviceCategoryId: expect.any(String),
    });
    expect(service.update).toHaveBeenCalled();
  });

  it('should remove a provider service category', async () => {
    expect(await controller.remove(uuid, { id: userId } as any)).toEqual({
      deleted: true,
    });
    expect(service.remove).toHaveBeenCalledWith(uuid, userId);
  });

  // Error handling tests
  it('should throw NotFoundException if provider service category not found', async () => {
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
      controller.create({ providerId: '', serviceCategoryId: '' }, {
        id: userId,
      } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException on update if not found', async () => {
    mockService.update.mockRejectedValueOnce(
      new NotFoundException('Not found'),
    );
    await expect(
      controller.update(
        uuidv4(),
        { providerId: uuidv4(), serviceCategoryId: uuidv4() },
        {
          id: userId,
        } as any,
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException on invalid update', async () => {
    mockService.update.mockRejectedValueOnce(
      new BadRequestException('Invalid data'),
    );
    await expect(
      controller.update(uuidv4(), { providerId: '', serviceCategoryId: '' }, {
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
