import { Test, TestingModule } from '@nestjs/testing';
import { APP_GUARD } from '@nestjs/core';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RequisitionTypesController } from './requisition-types.controller';
import { RequisitionTypesService } from '../services/requisition-types.service';

jest.mock('../../auth/guards/authorizations.guard', () => ({
  AuthorizationsGuard: { canActivate: () => true },
}));

describe('RequisitionTypesController', () => {
  let controller: RequisitionTypesController;
  let service: RequisitionTypesService;

  const userId = uuidv4();
  const uuid = uuidv4();

  const mockRequisitionType = {
    id: uuid,
    requisitionTypeName: 'Requisition name',
    requisitionTypeDescription: 'Une description',
  };

  const createDto = {
    requisitionTypeName: 'Requisition name',
    requisitionTypeDescription: 'Une description',
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockRequisitionType),
    findAll: jest.fn().mockResolvedValue([mockRequisitionType]),
    findOne: jest.fn().mockResolvedValue(mockRequisitionType),
    update: jest.fn().mockResolvedValue({
      ...mockRequisitionType,
      requisitionTypeName: 'Updated',
    }),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequisitionTypesController],
      providers: [
        { provide: RequisitionTypesService, useValue: mockService },
        { provide: APP_GUARD, useValue: { canActivate: () => true } },
      ],
    }).compile();

    controller = module.get<RequisitionTypesController>(RequisitionTypesController);
    service = module.get<RequisitionTypesService>(RequisitionTypesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a requisition type', async () => {
    expect(await controller.create(createDto, { id: userId } as any)).toEqual(
      mockRequisitionType,
    );
    expect(service.create).toHaveBeenCalledWith(createDto, userId);
  });

  it('should return all requisition types', async () => {
    expect(await controller.findAll({})).toEqual([mockRequisitionType]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a requisition type by id', async () => {
    expect(await controller.findOne(uuid)).toEqual(mockRequisitionType);
    expect(service.findOne).toHaveBeenCalledWith(uuid);
  });

  it('should update a requisition type', async () => {
    expect(
      await controller.update(uuid, { requisitionTypeName: 'Updated' }, {
        id: userId,
      } as any),
    ).toEqual({
      ...mockRequisitionType,
      requisitionTypeName: 'Updated',
    });
    expect(service.update).toHaveBeenCalledWith(
      uuid,
      { requisitionTypeName: 'Updated' },
      userId,
    );
  });

  it('should remove a requisition type', async () => {
    expect(await controller.remove(uuid, { id: userId } as any)).toEqual({
      deleted: true,
    });
    expect(service.remove).toHaveBeenCalledWith(uuid, userId);
  });

  // Error handling tests
  it('should throw NotFoundException if requisition type not found', async () => {
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
        { requisitionTypeName: '', requisitionTypeDescription: '' },
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
      controller.update(uuidv4(), { requisitionTypeName: 'X' }, {
        id: userId,
      } as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException on invalid update', async () => {
    mockService.update.mockRejectedValueOnce(
      new BadRequestException('Invalid data'),
    );
    await expect(
      controller.update(uuidv4(), { requisitionTypeName: '' }, {
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