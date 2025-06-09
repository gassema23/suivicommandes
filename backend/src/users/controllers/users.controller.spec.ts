import { Test, TestingModule } from '@nestjs/testing';
import { APP_GUARD } from '@nestjs/core';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';

jest.mock('../../auth/guards/authorizations.guard', () => ({
  AuthorizationsGuard: { canActivate: () => true },
}));

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const userId = uuidv4();
  const uuid = uuidv4();

  const mockUser = {
    id: uuid,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
  };

  const createDto = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'password123',
  };

  const paginatedResult = {
    data: [mockUser],
    meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockUser),
    findAll: jest.fn().mockResolvedValue(paginatedResult),
    findOne: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockResolvedValue({
      ...mockUser,
      firstName: 'Jane',
    }),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockService },
        { provide: APP_GUARD, useValue: { canActivate: () => true } },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    expect(await controller.create(createDto, { id: userId } as any)).toEqual(
      mockUser,
    );
    expect(service.create).toHaveBeenCalledWith(createDto, userId);
  });

  it('should return all users', async () => {
    expect(await controller.findAll({})).toEqual({
      ...paginatedResult,
      data: paginatedResult.data.map(() => expect.any(Object)),
    });
  });

  it('should return a user by id', async () => {
    expect(await controller.findOne(uuid)).toEqual(mockUser);
    expect(service.findOne).toHaveBeenCalledWith(uuid);
  });

  it('should update a user', async () => {
    expect(
      await controller.update(uuid, { firstName: 'Jane' }, {
        id: userId,
      } as any),
    ).toEqual({
      ...mockUser,
      firstName: 'Jane',
    });
    expect(service.update).toHaveBeenCalledWith(
      uuid,
      { firstName: 'Jane' },
      userId,
    );
  });

  it('should remove a user', async () => {
    expect(await controller.remove(uuid, { id: userId } as any)).toEqual({
      message: 'Utilisateur supprimé avec succès',
    });
    expect(service.remove).toHaveBeenCalledWith(uuid, userId);
  });

  // Error handling tests
  it('should throw NotFoundException if user not found', async () => {
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
        { firstName: '', lastName: '', email: '', password: '' },
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
      controller.update(uuidv4(), { firstName: 'X' }, {
        id: userId,
      } as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException on invalid update', async () => {
    mockService.update.mockRejectedValueOnce(
      new BadRequestException('Invalid data'),
    );
    await expect(
      controller.update(uuidv4(), { firstName: '' }, {
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
