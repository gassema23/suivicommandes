import { Test, TestingModule } from '@nestjs/testing';
import { APP_GUARD } from '@nestjs/core';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ProvidersController } from './providers.controller';
import { ProvidersService } from '../services/providers.service';

jest.mock('../../auth/guards/authorizations.guard', () => ({
  AuthorizationsGuard: { canActivate: () => true },
}));

describe('ProvidersController', () => {
  let controller: ProvidersController;
  let service: ProvidersService;

  const userId = uuidv4();
  const uuid = uuidv4();

  const mockProvider = {
    id: uuid,
    providerName: 'Provider name',
    providerCode: '6000',
  };

  const createDto = {
    providerName: 'Provider name',
    providerCode: '6000',
  };

  const paginatedResult = {
    data: [mockProvider],
    meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockProvider),
    findAll: jest.fn().mockResolvedValue(paginatedResult),
    findOne: jest.fn().mockResolvedValue(mockProvider),
    update: jest.fn().mockResolvedValue({
      ...mockProvider,
      providerName: 'Updated',
    }),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProvidersController],
      providers: [
        { provide: ProvidersService, useValue: mockService },
        { provide: APP_GUARD, useValue: { canActivate: () => true } },
      ],
    }).compile();

    controller = module.get<ProvidersController>(ProvidersController);
    service = module.get<ProvidersService>(ProvidersService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a provider', async () => {
    expect(await controller.create(createDto, { id: userId } as any)).toEqual(
      mockProvider,
    );
    expect(service.create).toHaveBeenCalledWith(createDto, userId);
  });

  it('should return all providers', async () => {
    expect(await controller.findAll({})).toEqual({
      ...paginatedResult,
      data: paginatedResult.data.map(() => expect.any(Object)),
    });
  });

  it('should return a provider by id', async () => {
    expect(await controller.findOne(uuid)).toEqual(mockProvider);
    expect(service.findOne).toHaveBeenCalledWith(uuid);
  });

  it('should update a provider', async () => {
    expect(
      await controller.update(uuid, { providerName: 'Updated' }, {
        id: userId,
      } as any),
    ).toEqual({
      ...mockProvider,
      providerName: 'Updated',
    });
    expect(service.update).toHaveBeenCalledWith(
      uuid,
      { providerName: 'Updated' },
      userId,
    );
  });

  it('should remove a provider', async () => {
    expect(await controller.remove(uuid, { id: userId } as any)).toEqual({
      deleted: true,
    });
    expect(service.remove).toHaveBeenCalledWith(uuid, userId);
  });

  // Error handling tests
  it('should throw NotFoundException if provider not found', async () => {
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
      controller.create({ providerName: '', providerCode: '' }, {
        id: userId,
      } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException on update if not found', async () => {
    mockService.update.mockRejectedValueOnce(
      new NotFoundException('Not found'),
    );
    await expect(
      controller.update(uuidv4(), { providerName: 'X' }, {
        id: userId,
      } as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException on invalid update', async () => {
    mockService.update.mockRejectedValueOnce(
      new BadRequestException('Invalid data'),
    );
    await expect(
      controller.update(uuidv4(), { providerName: '' }, {
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
