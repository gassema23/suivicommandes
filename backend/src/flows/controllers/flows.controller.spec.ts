import { Test, TestingModule } from '@nestjs/testing';
import { APP_GUARD } from '@nestjs/core';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { FlowsController } from './flows.controller';
import { FlowsService } from '../services/flows.service';

jest.mock('../../auth/guards/authorizations.guard', () => ({
  AuthorizationsGuard: { canActivate: () => true },
}));

describe('FlowsController', () => {
  let controller: FlowsController;
  let service: FlowsService;

  const userId = uuidv4();
  const uuid = uuidv4();

  const mockFlow = {
    id: uuid,
    flowName: 'Flow name',
    flowDescription: 'Une description',
  };

  const createDto = {
    flowName: 'Flow name',
    flowDescription: 'Une description',
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockFlow),
    findAll: jest.fn().mockResolvedValue([mockFlow]),
    findOne: jest.fn().mockResolvedValue(mockFlow),
    update: jest.fn().mockResolvedValue({
      ...mockFlow,
      flowName: 'Updated',
    }),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlowsController],
      providers: [
        { provide: FlowsService, useValue: mockService },
        { provide: APP_GUARD, useValue: { canActivate: () => true } },
      ],
    }).compile();

    controller = module.get<FlowsController>(FlowsController);
    service = module.get<FlowsService>(FlowsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a flow', async () => {
    expect(await controller.create(createDto, { id: userId } as any)).toEqual(
      mockFlow,
    );
    expect(service.create).toHaveBeenCalledWith(createDto, userId);
  });

  it('should return all flows', async () => {
    expect(await controller.findAll({})).toEqual([mockFlow]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a flow by id', async () => {
    expect(await controller.findOne(uuid)).toEqual(mockFlow);
    expect(service.findOne).toHaveBeenCalledWith(uuid);
  });

  it('should update a flow', async () => {
    expect(
      await controller.update(uuid, { flowName: 'Updated' }, {
        id: userId,
      } as any),
    ).toEqual({
      ...mockFlow,
      flowName: 'Updated',
    });
    expect(service.update).toHaveBeenCalledWith(
      uuid,
      { flowName: 'Updated' },
      userId,
    );
  });

  it('should remove a flow', async () => {
    expect(await controller.remove(uuid, { id: userId } as any)).toEqual({
      deleted: true,
    });
    expect(service.remove).toHaveBeenCalledWith(uuid, userId);
  });

  // Error handling tests
  it('should throw NotFoundException if flow not found', async () => {
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
      controller.create({ flowName: '', flowDescription: '' }, {
        id: userId,
      } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException on update if not found', async () => {
    mockService.update.mockRejectedValueOnce(
      new NotFoundException('Not found'),
    );
    await expect(
      controller.update(uuidv4(), { flowName: 'X' }, {
        id: userId,
      } as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException on invalid update', async () => {
    mockService.update.mockRejectedValueOnce(
      new BadRequestException('Invalid data'),
    );
    await expect(
      controller.update(uuidv4(), { flowName: '' }, {
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
