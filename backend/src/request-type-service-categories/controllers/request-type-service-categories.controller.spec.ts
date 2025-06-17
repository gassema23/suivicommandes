import { Test, TestingModule } from '@nestjs/testing';
import { RequestTypeServiceCategoriesController } from './request-type-service-categories.controller';
import { RequestTypeServiceCategoriesService } from '../services/request-type-service-categories.service';
import { APP_GUARD } from '@nestjs/core';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, NotFoundException } from '@nestjs/common';

jest.mock('../../auth/guards/authorizations.guard', () => ({
  AuthorizationsGuard: { canActivate: () => true },
}));

describe('RequestTypeServiceCategoriesController', () => {
  let controller: RequestTypeServiceCategoriesController;
  let service: RequestTypeServiceCategoriesService;

  const userId = uuidv4();
  const uuid = uuidv4();

  const mockRequestTypeServiceCategory = {
    id: uuid,
    availabilityDelay: 1,
    minimumRequiredDelay: 2,
    serviceActivationDelay: 3,
    requestType: { id: 'uuid-request-type', requestTypeName: 'Type A' },
    serviceCategory: {
      id: 'uuid-service-category',
      serviceCategoryName: 'Catégorie A',
    },
  };

  const createDto = {
    serviceCategoryId: 'uuid-service-category',
    requestTypeId: 'uuid-request-type',
    availabilityDelay: 1,
    minimumRequiredDelay: 2,
    serviceActivationDelay: 3,
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockRequestTypeServiceCategory),
    findAll: jest.fn().mockResolvedValue({
      data: [mockRequestTypeServiceCategory],
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
    }),
    findOne: jest.fn().mockResolvedValue(mockRequestTypeServiceCategory),
    update: jest.fn().mockResolvedValue({
      ...mockRequestTypeServiceCategory,
      availabilityDelay: 2,
    }),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestTypeServiceCategoriesController],
      providers: [
        { provide: RequestTypeServiceCategoriesService, useValue: mockService },
        { provide: APP_GUARD, useValue: { canActivate: () => true } },
      ],
    }).compile();

    controller = module.get<RequestTypeServiceCategoriesController>(
      RequestTypeServiceCategoriesController,
    );
    service = module.get<RequestTypeServiceCategoriesService>(
      RequestTypeServiceCategoriesService,
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a request type service category', async () => {
    expect(await controller.create(createDto, { id: userId } as any)).toEqual(
      mockRequestTypeServiceCategory,
    );
    expect(service.create).toHaveBeenCalledWith(createDto, userId);
  });

  it('should return paginated request type service categories', async () => {
    const result = await controller.findAll({ page: 1, limit: 10 });
    expect(result).toEqual({
      data: [mockRequestTypeServiceCategory],
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
    });
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a request type service category by id', async () => {
    expect(await controller.findOne(uuid)).toEqual(
      mockRequestTypeServiceCategory,
    );
    expect(service.findOne).toHaveBeenCalledWith(uuid);
  });

  it('should update a request type service category', async () => {
    expect(
      await controller.update(uuid, { availabilityDelay: 2 }, {
        id: userId,
      } as any),
    ).toEqual({
      ...mockRequestTypeServiceCategory,
      availabilityDelay: 2,
    });
    expect(service.update).toHaveBeenCalledWith(
      uuid,
      { availabilityDelay: 2 },
      userId,
    );
  });

  it('should remove a request type service category', async () => {
    expect(await controller.remove(uuid, { id: userId } as any)).toEqual({
      deleted: true,
    });
    expect(service.remove).toHaveBeenCalledWith(uuid, userId);
  });

  // Error handling tests
  it('should throw NotFoundException if request type service category not found', async () => {
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
        { serviceCategoryId: '', requestTypeId: '', availabilityDelay: 0 },
        { id: userId } as any,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException on update if not found', async () => {
    mockService.update.mockRejectedValueOnce(
      new NotFoundException('Not found'),
    );
    await expect(
      controller.update(uuidv4(), { availabilityDelay: 1 }, {
        id: userId,
      } as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException on invalid update', async () => {
    mockService.update.mockRejectedValueOnce(
      new BadRequestException('Invalid data'),
    );
    await expect(
      controller.update(uuidv4(), { availabilityDelay: 0 }, {
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
