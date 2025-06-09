import { Test, TestingModule } from '@nestjs/testing';
import { APP_GUARD } from '@nestjs/core';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ProviderDisponibilitiesController } from './provider-disponibilities.controller';
import { ProviderDisponibilitiesService } from '../services/provider-disponibilities.service';

jest.mock('../../auth/guards/authorizations.guard', () => ({
  AuthorizationsGuard: { canActivate: () => true },
}));

describe('ProviderDisponibilitiesController', () => {
  let controller: ProviderDisponibilitiesController;
  let service: ProviderDisponibilitiesService;

  const userId = uuidv4();
  const uuid = uuidv4();

  const mockProviderDisponibility = {
    id: uuid,
    providerDisponibilityName: 'Disponibilité fournisseur',
    providerDisponibilityDescription: 'Une description',
  };

  const createDto = {
    providerDisponibilityName: 'Disponibilité fournisseur',
    providerDisponibilityDescription: 'Une description',
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockProviderDisponibility),
    findAll: jest.fn().mockResolvedValue([mockProviderDisponibility]),
    findOne: jest.fn().mockResolvedValue(mockProviderDisponibility),
    update: jest.fn().mockResolvedValue({
      ...mockProviderDisponibility,
      providerDisponibilityName: 'Updated',
    }),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProviderDisponibilitiesController],
      providers: [
        { provide: ProviderDisponibilitiesService, useValue: mockService },
        { provide: APP_GUARD, useValue: { canActivate: () => true } },
      ],
    }).compile();

    controller = module.get<ProviderDisponibilitiesController>(ProviderDisponibilitiesController);
    service = module.get<ProviderDisponibilitiesService>(ProviderDisponibilitiesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a provider disponibility', async () => {
    expect(await controller.create(createDto, { id: userId } as any)).toEqual(
      mockProviderDisponibility,
    );
    expect(service.create).toHaveBeenCalledWith(createDto, userId);
  });

  it('should return all provider disponibilities', async () => {
    expect(await controller.findAll({})).toEqual([mockProviderDisponibility]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a provider disponibility by id', async () => {
    expect(await controller.findOne(uuid)).toEqual(mockProviderDisponibility);
    expect(service.findOne).toHaveBeenCalledWith(uuid);
  });

  it('should update a provider disponibility', async () => {
    expect(
      await controller.update(uuid, { providerDisponibilityName: 'Updated' }, {
        id: userId,
      } as any),
    ).toEqual({
      ...mockProviderDisponibility,
      providerDisponibilityName: 'Updated',
    });
    expect(service.update).toHaveBeenCalledWith(
      uuid,
      { providerDisponibilityName: 'Updated' },
      userId,
    );
  });

  it('should remove a provider disponibility', async () => {
    expect(await controller.remove(uuid, { id: userId } as any)).toEqual({
      deleted: true,
    });
    expect(service.remove).toHaveBeenCalledWith(uuid, userId);
  });

  // Error handling tests
  it('should throw NotFoundException if provider disponibility not found', async () => {
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
        { providerDisponibilityName: '', providerDisponibilityDescription: '' },
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
      controller.update(uuidv4(), { providerDisponibilityName: 'X' }, {
        id: userId,
      } as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException on invalid update', async () => {
    mockService.update.mockRejectedValueOnce(
      new BadRequestException('Invalid data'),
    );
    await expect(
      controller.update(uuidv4(), { providerDisponibilityName: '' }, {
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