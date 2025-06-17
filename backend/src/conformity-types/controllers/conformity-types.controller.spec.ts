import { Test, TestingModule } from '@nestjs/testing';
import { ConformityTypesController } from './conformity-types.controller';
import { ConformityTypesService } from '../services/conformity-types.service';
import { APP_GUARD } from '@nestjs/core';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, NotFoundException } from '@nestjs/common';

jest.mock('../../auth/guards/authorizations.guard', () => ({
  AuthorizationsGuard: { canActivate: () => true },
}));

describe('ConformityTypesController', () => {
  let controller: ConformityTypesController;
  let service: ConformityTypesService;

  const userId = uuidv4();
  const uuid = uuidv4();

  const mockConformityType = {
    id: uuid,
    conformityTypeName: 'Fournisseur',
    conformityTypeDescription: 'Une description',
  };

  const createDto = {
    conformityTypeName: 'Fournisseur',
    conformityTypeDescription: 'Une description',
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockConformityType),
    findAll: jest.fn().mockResolvedValue([mockConformityType]),
    findOne: jest.fn().mockResolvedValue(mockConformityType),
    update: jest.fn().mockResolvedValue({
      ...mockConformityType,
      conformityTypeName: 'Updated',
    }),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConformityTypesController],
      providers: [
        { provide: ConformityTypesService, useValue: mockService },
        { provide: APP_GUARD, useValue: { canActivate: () => true } },
      ],
    }).compile();

    controller = module.get<ConformityTypesController>(
      ConformityTypesController,
    );
    service = module.get<ConformityTypesService>(ConformityTypesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a conformity type', async () => {
    expect(await controller.create(createDto, { id: userId } as any)).toEqual(
      mockConformityType,
    );
    expect(service.create).toHaveBeenCalledWith(createDto, userId);
  });

  it('should return all conformity types', async () => {
    expect(await controller.findAll({})).toEqual([mockConformityType]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a conformity type by id', async () => {
    expect(await controller.findOne(uuid)).toEqual(mockConformityType);
    expect(service.findOne).toHaveBeenCalledWith(uuid);
  });

  it('should update a conformity type', async () => {
    expect(
      await controller.update(uuid, { conformityTypeName: 'Updated' }, {
        id: userId,
      } as any),
    ).toEqual({
      ...mockConformityType,
      conformityTypeName: 'Updated',
    });
    expect(service.update).toHaveBeenCalledWith(
      uuid,
      { conformityTypeName: 'Updated' },
      userId,
    );
  });

  it('should remove a conformity type', async () => {
    expect(await controller.remove(uuid, { id: userId } as any)).toEqual({
      deleted: true,
    });
    expect(service.remove).toHaveBeenCalledWith(uuid, userId);
  });

  // Error handling tests
  it('should throw NotFoundException if conformity type not found', async () => {
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
        { conformityTypeName: '', conformityTypeDescription: '' },
        { id: userId } as any,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException on update if not found', async () => {
    mockService.update.mockRejectedValueOnce(
      new NotFoundException('Not found'),
    );
    await expect(
      controller.update(uuidv4(), { conformityTypeName: 'X' }, {
        id: userId,
      } as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException on invalid update', async () => {
    mockService.update.mockRejectedValueOnce(
      new BadRequestException('Invalid data'),
    );
    await expect(
      controller.update(uuidv4(), { conformityTypeName: '' }, {
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
