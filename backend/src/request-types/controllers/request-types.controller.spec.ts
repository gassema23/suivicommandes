import { Test, TestingModule } from '@nestjs/testing';
import { APP_GUARD } from '@nestjs/core';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RequestTypesController } from './request-types.controller';
import { RequestTypesService } from '../services/request-types.service';

jest.mock('../../auth/guards/authorizations.guard', () => ({
  AuthorizationsGuard: { canActivate: () => true },
}));

describe('RequestTypesController', () => {
  let controller: RequestTypesController;
  let service: RequestTypesService;

  const userId = uuidv4();
  const uuid = uuidv4();

  const mockRequestType = {
    id: uuid,
    requestTypeName: 'Request type name',
    requestTypeDescription: 'Une description',
  };

  const createDto = {
    requestTypeName: 'Request type name',
    requestTypeDescription: 'Une description',
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockRequestType),
    findAll: jest.fn().mockResolvedValue([mockRequestType]),
    findOne: jest.fn().mockResolvedValue(mockRequestType),
    update: jest.fn().mockResolvedValue({
      ...mockRequestType,
      requestTypeName: 'Updated',
    }),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestTypesController],
      providers: [
        { provide: RequestTypesService, useValue: mockService },
        { provide: APP_GUARD, useValue: { canActivate: () => true } },
      ],
    }).compile();

    controller = module.get<RequestTypesController>(RequestTypesController);
    service = module.get<RequestTypesService>(RequestTypesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a request type', async () => {
    expect(await controller.create(createDto, { id: userId } as any)).toEqual(
      mockRequestType,
    );
    expect(service.create).toHaveBeenCalledWith(createDto, userId);
  });

  it('should return all request types', async () => {
    expect(await controller.findAll({})).toEqual([mockRequestType]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a request type by id', async () => {
    expect(await controller.findOne(uuid)).toEqual(mockRequestType);
    expect(service.findOne).toHaveBeenCalledWith(uuid);
  });

  it('should update a request type', async () => {
    expect(
      await controller.update(uuid, { requestTypeName: 'Updated' }, {
        id: userId,
      } as any),
    ).toEqual({
      ...mockRequestType,
      requestTypeName: 'Updated',
    });
    expect(service.update).toHaveBeenCalledWith(
      uuid,
      { requestTypeName: 'Updated' },
      userId,
    );
  });

  it('should remove a request type', async () => {
    expect(await controller.remove(uuid, { id: userId } as any)).toEqual({
      deleted: true,
    });
    expect(service.remove).toHaveBeenCalledWith(uuid, userId);
  });

  // Error handling tests
  it('should throw NotFoundException if request type not found', async () => {
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
      controller.create({ requestTypeName: '', requestTypeDescription: '' }, {
        id: userId,
      } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException on update if not found', async () => {
    mockService.update.mockRejectedValueOnce(
      new NotFoundException('Not found'),
    );
    await expect(
      controller.update(uuidv4(), { requestTypeName: 'X' }, {
        id: userId,
      } as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException on invalid update', async () => {
    mockService.update.mockRejectedValueOnce(
      new BadRequestException('Invalid data'),
    );
    await expect(
      controller.update(uuidv4(), { requestTypeName: '' }, {
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
