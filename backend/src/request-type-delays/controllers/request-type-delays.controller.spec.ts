import { Test, TestingModule } from '@nestjs/testing';
import { RequestTypeDelaysController } from './request-type-delays.controller';
import { RequestTypeDelaysService } from '../services/request-type-delays.service';
import { APP_GUARD } from '@nestjs/core';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, NotFoundException } from '@nestjs/common';

jest.mock('../../auth/guards/authorizations.guard', () => ({
  AuthorizationsGuard: { canActivate: () => true },
}));

describe('RequestTypeDelaysController', () => {
  let controller: RequestTypeDelaysController;
  let service: RequestTypeDelaysService;

  const userId = uuidv4();
  const uuid = uuidv4();

  const mockRequestTypeDelay = {
    id: uuid,
    delayValue: 5,
    requestTypeServiceCategory: { id: 'uuid-rtsc' },
    delayType: { id: 'uuid-delay-type' },
  };

  const createDto = {
    requestTypeServiceCategoryId: 'uuid-rtsc',
    delayTypeId: 'uuid-delay-type',
    delayValue: 5,
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockRequestTypeDelay),
    findAll: jest.fn().mockResolvedValue({
      data: [mockRequestTypeDelay],
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
    }),
    findOne: jest.fn().mockResolvedValue(mockRequestTypeDelay),
    update: jest.fn().mockResolvedValue({
      ...mockRequestTypeDelay,
      delayValue: 10,
    }),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestTypeDelaysController],
      providers: [
        { provide: RequestTypeDelaysService, useValue: mockService },
        { provide: APP_GUARD, useValue: { canActivate: () => true } },
      ],
    }).compile();

    controller = module.get<RequestTypeDelaysController>(
      RequestTypeDelaysController,
    );
    service = module.get<RequestTypeDelaysService>(RequestTypeDelaysService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a request type delay', async () => {
    expect(await controller.create(createDto, { id: userId } as any)).toEqual(
      mockRequestTypeDelay,
    );
    expect(service.create).toHaveBeenCalledWith(createDto, userId);
  });

  it('should return paginated request type delays', async () => {
    const result = await controller.findAll({ page: 1, limit: 10 });
    expect(result).toEqual({
      data: [mockRequestTypeDelay],
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
    });
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a request type delay by id', async () => {
    expect(await controller.findOne(uuid)).toEqual(mockRequestTypeDelay);
    expect(service.findOne).toHaveBeenCalledWith(uuid);
  });

  it('should update a request type delay', async () => {
    expect(
      await controller.update(uuid, { delayValue: 10 }, {
        id: userId,
      } as any),
    ).toEqual({
      ...mockRequestTypeDelay,
      delayValue: 10,
    });
    expect(service.update).toHaveBeenCalledWith(
      uuid,
      { delayValue: 10 },
      userId,
    );
  });

  it('should remove a request type delay', async () => {
    expect(await controller.remove(uuid, { id: userId } as any)).toEqual({
      deleted: true,
    });
    expect(service.remove).toHaveBeenCalledWith(uuid, userId);
  });

  // Error handling tests
  it('should throw NotFoundException if request type delay not found', async () => {
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
        { requestTypeServiceCategoryId: '', delayTypeId: '', delayValue: 0 },
        { id: userId } as any,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException on update if not found', async () => {
    mockService.update.mockRejectedValueOnce(
      new NotFoundException('Not found'),
    );
    await expect(
      controller.update(uuidv4(), { delayValue: 1 }, {
        id: userId,
      } as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException on invalid update', async () => {
    mockService.update.mockRejectedValueOnce(
      new BadRequestException('Invalid data'),
    );
    await expect(
      controller.update(uuidv4(), { delayValue: 0 }, {
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
