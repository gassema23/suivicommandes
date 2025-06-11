import { Test, TestingModule } from '@nestjs/testing';
import { DeliverableDelayRequestTypesController } from './deliverable-delay-request-types.controller';
import { DeliverableDelayRequestTypesService } from '../services/deliverable-delay-request-types.service';
import { APP_GUARD } from '@nestjs/core';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthorizationsGuard } from '../../auth/guards/authorizations.guard';

describe('DeliverableDelayRequestTypesController', () => {
  let controller: DeliverableDelayRequestTypesController;
  let service: DeliverableDelayRequestTypesService;

  const userId = uuidv4();
  const uuid = uuidv4();

  const mockDeliverableDelayRequestType = {
    id: uuid,
    requestTypeServiceCategory: { id: 'uuid-rtsc' },
    deliverable: { id: 'uuid-deliverable' },
  };

  const createDto = {
    requestTypeServiceCategoryId: 'uuid-rtsc',
    deliverableId: 'uuid-deliverable',
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockDeliverableDelayRequestType),
    findAll: jest.fn().mockResolvedValue({
      data: [mockDeliverableDelayRequestType],
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
    }),
    findOne: jest.fn().mockResolvedValue(mockDeliverableDelayRequestType),
    update: jest.fn().mockResolvedValue({
      ...mockDeliverableDelayRequestType,
      requestTypeServiceCategory: { id: 'uuid-rtsc' },
    }),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliverableDelayRequestTypesController],
      providers: [
        { provide: DeliverableDelayRequestTypesService, useValue: mockService },
      ],
    })
      .overrideGuard(AuthorizationsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<DeliverableDelayRequestTypesController>(
      DeliverableDelayRequestTypesController,
    );
    service = module.get<DeliverableDelayRequestTypesService>(
      DeliverableDelayRequestTypesService,
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a deliverable delay request type', async () => {
    expect(await controller.create(createDto, { id: userId } as any)).toEqual(
      mockDeliverableDelayRequestType,
    );
    expect(service.create).toHaveBeenCalledWith(createDto, userId);
  });

  it('should return paginated deliverable delay request types', async () => {
    const result = await controller.findAll({ page: 1, limit: 10 });
    expect(result).toEqual({
      data: [mockDeliverableDelayRequestType],
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
    });
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a deliverable delay request type by id', async () => {
    expect(await controller.findOne(uuid)).toEqual(
      mockDeliverableDelayRequestType,
    );
    expect(service.findOne).toHaveBeenCalledWith(uuid);
  });

  it('should update a deliverable delay request type', async () => {
    expect(
      await controller.update(
        uuid,
        { requestTypeServiceCategoryId: 'uuid-rtsc' },
        {
          id: userId,
        } as any,
      ),
    ).toEqual({
      ...mockDeliverableDelayRequestType,
      requestTypeServiceCategory: { id: 'uuid-rtsc' },
    });
    expect(service.update).toHaveBeenCalledWith(
      uuid,
      { requestTypeServiceCategoryId: 'uuid-rtsc' },
      userId,
    );
  });

  it('should remove a deliverable delay request type', async () => {
    expect(await controller.remove(uuid, { id: userId } as any)).toEqual({
      deleted: true,
    });
    expect(service.remove).toHaveBeenCalledWith(uuid, userId);
  });

  // Error handling tests
  it('should throw NotFoundException if deliverable delay request type not found', async () => {
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
        { requestTypeServiceCategoryId: '', deliverableId: '' },
        { id: userId } as any,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException on update if not found', async () => {
    mockService.update.mockRejectedValueOnce(
      new NotFoundException('Not found'),
    );
    await expect(
      controller.update(
        uuidv4(),
        { requestTypeServiceCategoryId: 'uuid-rtsc' },
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
      controller.update(uuidv4(), { requestTypeServiceCategoryId: '' }, {
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
