import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from './clients.controller';
import { ClientsService } from '../services/clients.service';
import { APP_GUARD } from '@nestjs/core';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, NotFoundException } from '@nestjs/common';

jest.mock('../../auth/guards/authorizations.guard', () => ({
  AuthorizationsGuard: { canActivate: () => true },
}));

describe('ClientsController', () => {
  let controller: ClientsController;
  let service: ClientsService;

  const uuid = uuidv4();
  const userId = uuidv4();

  const mockClient = {
    id: uuid,
    clientName: 'Test Client',
    clientNumber: '6000',
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockClient),
    findAll: jest.fn().mockResolvedValue([mockClient]),
    findOne: jest.fn().mockResolvedValue(mockClient),
    update: jest.fn().mockResolvedValue({
      ...mockClient,
      clientName: 'Updated',
      clientNumber: '8000',
    }),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: ClientsService, useValue: mockService },
        { provide: APP_GUARD, useValue: { canActivate: () => true } }, // mock global guard
      ],
      controllers: [ClientsController],
    }).compile();

    controller = module.get<ClientsController>(ClientsController);
    service = module.get<ClientsService>(ClientsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a client', async () => {
    expect(
      await controller.create(
        { clientName: 'Test Client', clientNumber: '6000' },
        { id: userId } as any,
      ),
    ).toEqual(mockClient);
    expect(service.create).toHaveBeenCalledWith(
      { clientName: 'Test Client', clientNumber: '6000' },
      userId,
    );
  });

  it('should return a client by id', async () => {
    expect(await controller.findOne(uuid)).toEqual(mockClient);
    expect(service.findOne).toHaveBeenCalledWith(uuid);
  });

  it('should return a client by id', async () => {
    expect(await controller.findOne(uuid)).toEqual(mockClient);
    expect(service.findOne).toHaveBeenCalledWith(uuid);
  });

  it('should update a client', async () => {
    expect(
      await controller.update(
        uuid,
        { clientName: 'Updated', clientNumber: '8000' },
        {
          id: userId,
        } as any,
      ),
    ).toEqual({ ...mockClient, clientName: 'Updated', clientNumber: '8000' });
    expect(service.update).toHaveBeenCalledWith(
      uuid,
      { clientName: 'Updated', clientNumber: '8000' },
      userId,
    );
  });

  it('should remove a client', async () => {
    expect(await controller.remove(uuid, { id: userId } as any)).toEqual({
      deleted: true,
    });
    expect(service.remove).toHaveBeenCalledWith(uuid, userId);
  });

  // Additional tests for error handling
  it('should throw NotFoundException if client not found', async () => {
    mockService.findOne.mockRejectedValueOnce(
      new NotFoundException('Client not found'),
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
      controller.create({ clientName: '', clientNumber: '' }, {
        id: userId,
      } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException on update if client not found', async () => {
    mockService.update.mockRejectedValueOnce(
      new NotFoundException('Client not found'),
    );
    await expect(
      controller.update(uuidv4(), { clientName: 'X' }, { id: userId } as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException on invalid update', async () => {
    mockService.update.mockRejectedValueOnce(
      new BadRequestException('Invalid data'),
    );
    await expect(
      controller.update(uuidv4(), { clientName: '' }, { id: userId } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException on remove if client not found', async () => {
    mockService.remove.mockRejectedValueOnce(
      new NotFoundException('Client not found'),
    );
    await expect(
      controller.remove(uuidv4(), { id: userId } as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if clientName already exists', async () => {
    mockService.create.mockRejectedValueOnce(
      new BadRequestException('Client name already exists'),
    );
    await expect(
      controller.create({ clientName: 'Test Client', clientNumber: '9999' }, {
        id: userId,
      } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if clientNumber already exists', async () => {
    mockService.create.mockRejectedValueOnce(
      new BadRequestException('Client number already exists'),
    );
    await expect(
      controller.create(
        { clientName: 'Another Client', clientNumber: '6000' },
        { id: userId } as any,
      ),
    ).rejects.toThrow(BadRequestException);
  });
});
