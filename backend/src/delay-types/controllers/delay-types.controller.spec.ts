import { Test, TestingModule } from '@nestjs/testing';
import { DelayTypesController } from './delay-types.controller';
import { DelayTypesService } from '../services/delay-types.service';
import { APP_GUARD } from '@nestjs/core';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, NotFoundException } from '@nestjs/common';

jest.mock('../../auth/guards/authorizations.guard', () => ({
  AuthorizationsGuard: { canActivate: () => true },
}));

describe('DelayTypesController', () => {
  let controller: DelayTypesController;
  let service: DelayTypesService;

  const userId = uuidv4();
  const uuid = uuidv4();

  const mockDelayType = {
    id: uuid,
    delayTypeName: 'Delay Type name',
    delayTypeDescription: 'Une description',
  };

  const createDto = {
    delayTypeName: 'Delay Type name',
    delayTypeDescription: 'Une description',
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockDelayType),
    findAll: jest.fn().mockResolvedValue([mockDelayType]),
    findOne: jest.fn().mockResolvedValue(mockDelayType),
    update: jest.fn().mockResolvedValue({
      ...mockDelayType,
      delayTypeName: 'Updated',
    }),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DelayTypesController],
      providers: [
        { provide: DelayTypesService, useValue: mockService },
        { provide: APP_GUARD, useValue: { canActivate: () => true } },
      ],
    }).compile();

    controller = module.get<DelayTypesController>(DelayTypesController);
    service = module.get<DelayTypesService>(DelayTypesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a delay type', async () => {
    expect(await controller.create(createDto, { id: userId } as any)).toEqual(
      mockDelayType,
    );
    expect(service.create).toHaveBeenCalledWith(createDto, userId);
  });

  it('should return all delay types', async () => {
    expect(await controller.findAll({})).toEqual([mockDelayType]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a delay type by id', async () => {
    expect(await controller.findOne(uuid)).toEqual(mockDelayType);
    expect(service.findOne).toHaveBeenCalledWith(uuid);
  });

  it('should update a delay type', async () => {
    expect(
      await controller.update(uuid, { delayTypeName: 'Updated' }, {
        id: userId,
      } as any),
    ).toEqual({
      ...mockDelayType,
      delayTypeName: 'Updated',
    });
    expect(service.update).toHaveBeenCalledWith(
      uuid,
      { delayTypeName: 'Updated' },
      userId,
    );
  });

  it('should remove a delay type', async () => {
    expect(await controller.remove(uuid, { id: userId } as any)).toEqual({
      deleted: true,
    });
    expect(service.remove).toHaveBeenCalledWith(uuid, userId);
  });

  // Error handling tests
  it('should throw NotFoundException if delay type not found', async () => {
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
      controller.create({ delayTypeName: '', delayTypeDescription: '' }, {
        id: userId,
      } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException on update if not found', async () => {
    mockService.update.mockRejectedValueOnce(
      new NotFoundException('Not found'),
    );
    await expect(
      controller.update(uuidv4(), { delayTypeName: 'X' }, {
        id: userId,
      } as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException on invalid update', async () => {
    mockService.update.mockRejectedValueOnce(
      new BadRequestException('Invalid data'),
    );
    await expect(
      controller.update(uuidv4(), { delayTypeName: '' }, {
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
