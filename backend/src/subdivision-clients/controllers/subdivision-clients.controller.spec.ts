import { Test, TestingModule } from '@nestjs/testing';
import { APP_GUARD } from '@nestjs/core';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SubdivisionClientsController } from './subdivision-clients.controller';
import { SubdivisionClientsService } from '../services/subdivision-clients.service';

jest.mock('../../auth/guards/authorizations.guard', () => ({
  AuthorizationsGuard: { canActivate: () => true },
}));

describe('SubdivisionClientsController', () => {
  let controller: SubdivisionClientsController;
  let service: SubdivisionClientsService;

  const userId = uuidv4();
  const uuid = uuidv4();

  const mockSubdivision = {
    id: uuid,
    subdivisionClientName: 'Subdivision name',
    subdivisionClientNumber: '3000',
    clientId: uuidv4(),
  };

  const createDto = {
    subdivisionClientName: 'Subdivision name',
    subdivisionClientNumber: '3000',
    clientId: uuidv4(),
  };

  const paginatedResult = {
    data: [mockSubdivision],
    meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockSubdivision),
    findAll: jest.fn().mockResolvedValue(paginatedResult),
    findOne: jest.fn().mockResolvedValue(mockSubdivision),
    update: jest.fn().mockResolvedValue({
      ...mockSubdivision,
      subdivisionClientName: 'Updated',
    }),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubdivisionClientsController],
      providers: [
        { provide: SubdivisionClientsService, useValue: mockService },
        { provide: APP_GUARD, useValue: { canActivate: () => true } },
      ],
    }).compile();

    controller = module.get<SubdivisionClientsController>(
      SubdivisionClientsController,
    );
    service = module.get<SubdivisionClientsService>(SubdivisionClientsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a subdivision client', async () => {
    expect(await controller.create(createDto, { id: userId } as any)).toEqual(
      mockSubdivision,
    );
    expect(service.create).toHaveBeenCalledWith(createDto, userId);
  });

  it('should return all subdivision clients', async () => {
    expect(await controller.findAll({})).toEqual({
      ...paginatedResult,
      data: paginatedResult.data.map(() => expect.any(Object)),
    });
  });

  it('should return a subdivision client by id', async () => {
    expect(await controller.findOne(uuid)).toEqual(mockSubdivision);
    expect(service.findOne).toHaveBeenCalledWith(uuid);
  });

  it('should update a subdivision client', async () => {
    expect(
      await controller.update(uuid, { subdivisionClientName: 'Updated' }, {
        id: userId,
      } as any),
    ).toEqual({
      ...mockSubdivision,
      subdivisionClientName: 'Updated',
    });
    expect(service.update).toHaveBeenCalledWith(
      uuid,
      { subdivisionClientName: 'Updated' },
      userId,
    );
  });

  it('should remove a subdivision client', async () => {
    expect(await controller.remove(uuid, { id: userId } as any)).toEqual({
      deleted: true,
    });
    expect(service.remove).toHaveBeenCalledWith(uuid, userId);
  });

  // Error handling tests
  it('should throw NotFoundException if subdivision client not found', async () => {
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
        {
          subdivisionClientName: '',
          subdivisionClientNumber: '',
          clientId: '',
        },
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
      controller.update(uuidv4(), { subdivisionClientName: 'X' }, {
        id: userId,
      } as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException on invalid update', async () => {
    mockService.update.mockRejectedValueOnce(
      new BadRequestException('Invalid data'),
    );
    await expect(
      controller.update(uuidv4(), { subdivisionClientName: '' }, {
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
