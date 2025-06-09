import { Test, TestingModule } from '@nestjs/testing';
import { APP_GUARD } from '@nestjs/core';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ServiceCategoriesController } from './service-categories.controller';
import { ServiceCategoriesService } from '../services/service-categories.service';

jest.mock('../../auth/guards/authorizations.guard', () => ({
  AuthorizationsGuard: { canActivate: () => true },
}));

describe('ServiceCategoriesController', () => {
  let controller: ServiceCategoriesController;
  let service: ServiceCategoriesService;

  const userId = uuidv4();
  const uuid = uuidv4();

  const mockCategory = {
    id: uuid,
    serviceCategoryName: 'Category name',
    serviceId: 'uuid-service',
    serviceCategoryDescription: 'Description',
    isMultiLink: true,
    isMultiProvider: false,
    isRequiredExpertise: false,
  };

  const createDto = {
    serviceCategoryName: 'Category name',
    serviceId: 'uuid-service',
    serviceCategoryDescription: 'Description',
    isMultiLink: true,
    isMultiProvider: false,
    isRequiredExpertise: false,
  };

  const updateDto = {
    serviceCategoryName: 'Updated',
    serviceId: 'uuid-service',
    serviceCategoryDescription: 'Updated description',
    isMultiLink: false,
    isMultiProvider: true,
    isRequiredExpertise: true,
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
      ...updateDto,
    }),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceCategoriesController],
      providers: [
        { provide: ServiceCategoriesService, useValue: mockService },
        { provide: APP_GUARD, useValue: { canActivate: () => true } },
      ],
    }).compile();

    controller = module.get<ServiceCategoriesController>(
      ServiceCategoriesController,
    );
    service = module.get<ServiceCategoriesService>(ServiceCategoriesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a service category', async () => {
    expect(await controller.create(createDto, { id: userId } as any)).toEqual(
      mockCategory,
    );
    expect(service.create).toHaveBeenCalledWith(createDto, userId);
  });

  it('should return all service categories', async () => {
    expect(await controller.findAll({})).toEqual(paginatedResult);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a service category by id', async () => {
    expect(await controller.findOne(uuid)).toEqual(mockCategory);
    expect(service.findOne).toHaveBeenCalledWith(uuid);
  });

  it('should update a service category', async () => {
    expect(
      await controller.update(uuid, updateDto, {
        id: userId,
      } as any),
    ).toEqual({
      ...mockCategory,
      ...updateDto,
    });
    expect(service.update).toHaveBeenCalledWith(uuid, updateDto, userId);
  });

  it('should remove a service category', async () => {
    expect(await controller.remove(uuid, { id: userId } as any)).toEqual({
      deleted: true,
    });
    expect(service.remove).toHaveBeenCalledWith(uuid, userId);
  });

  // Error handling tests
  it('should throw NotFoundException if service category not found', async () => {
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
        {
          serviceCategoryName: '',
          serviceId: '',
          serviceCategoryDescription: '',
        },
        { id: userId } as any,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException on update if not found', async () => {
    mockService.update.mockRejectedValueOnce(
      new NotFoundException('Not found'),
    );
    await expect(
      controller.update(uuidv4(), { serviceCategoryName: 'X', serviceId: '' }, {
        id: userId,
      } as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException on invalid update', async () => {
    mockService.update.mockRejectedValueOnce(
      new BadRequestException('Invalid data'),
    );
    await expect(
      controller.update(
        uuidv4(),
        {
          serviceCategoryName: '',
          serviceId: '',
          serviceCategoryDescription: '',
        },
        { id: userId } as any,
      ),
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
