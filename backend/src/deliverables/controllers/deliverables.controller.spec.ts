import { Test, TestingModule } from '@nestjs/testing';
import { APP_GUARD } from '@nestjs/core';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DeliverablesController } from './deliverables.controller';
import { DeliverablesService } from '../services/deliverables.service';

jest.mock('../../auth/guards/authorizations.guard', () => ({
  AuthorizationsGuard: { canActivate: () => true },
}));

describe('DeliverablesController', () => {
  let controller: DeliverablesController;
  let service: DeliverablesService;

  const userId = uuidv4();
  const uuid = uuidv4();

  const mockDeliverable = {
    id: uuid,
    deliverableName: 'Deliverable name',
    deliverableDescription: 'Une description',
  };

  const createDto = {
    deliverableName: 'Deliverable name',
    deliverableDescription: 'Une description',
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockDeliverable),
    findAll: jest.fn().mockResolvedValue([mockDeliverable]),
    findOne: jest.fn().mockResolvedValue(mockDeliverable),
    update: jest.fn().mockResolvedValue({
      ...mockDeliverable,
      deliverableName: 'Updated',
    }),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliverablesController],
      providers: [
        { provide: DeliverablesService, useValue: mockService },
        { provide: APP_GUARD, useValue: { canActivate: () => true } },
      ],
    }).compile();

    controller = module.get<DeliverablesController>(DeliverablesController);
    service = module.get<DeliverablesService>(DeliverablesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a deliverable', async () => {
    expect(await controller.create(createDto, { id: userId } as any)).toEqual(
      mockDeliverable,
    );
    expect(service.create).toHaveBeenCalledWith(createDto, userId);
  });

  it('should return all deliverables', async () => {
    expect(await controller.findAll({})).toEqual([mockDeliverable]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a deliverable by id', async () => {
    expect(await controller.findOne(uuid)).toEqual(mockDeliverable);
    expect(service.findOne).toHaveBeenCalledWith(uuid);
  });

  it('should update a deliverable', async () => {
    expect(
      await controller.update(uuid, { deliverableName: 'Updated' }, {
        id: userId,
      } as any),
    ).toEqual({
      ...mockDeliverable,
      deliverableName: 'Updated',
    });
    expect(service.update).toHaveBeenCalledWith(
      uuid,
      { deliverableName: 'Updated' },
      userId,
    );
  });

  it('should remove a deliverable', async () => {
    expect(await controller.remove(uuid, { id: userId } as any)).toEqual({
      deleted: true,
    });
    expect(service.remove).toHaveBeenCalledWith(uuid, userId);
  });

  // Error handling tests
  it('should throw NotFoundException if deliverable not found', async () => {
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
      controller.create({ deliverableName: '', deliverableDescription: '' }, {
        id: userId,
      } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException on update if not found', async () => {
    mockService.update.mockRejectedValueOnce(
      new NotFoundException('Not found'),
    );
    await expect(
      controller.update(uuidv4(), { deliverableName: 'X' }, {
        id: userId,
      } as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException on invalid update', async () => {
    mockService.update.mockRejectedValueOnce(
      new BadRequestException('Invalid data'),
    );
    await expect(
      controller.update(uuidv4(), { deliverableName: '' }, {
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
