import { Test, TestingModule } from '@nestjs/testing';
import { APP_GUARD } from '@nestjs/core';
import { v4 as uuidv4 } from 'uuid';
import {
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from '../services/roles.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';

jest.mock('../../auth/guards/authorizations.guard', () => ({
  AuthorizationsGuard: { canActivate: () => true },
}));

describe('RolesController', () => {
  let controller: RolesController;
  let service: RolesService;

  const userId = uuidv4();
  const uuid = uuidv4();

  const mockRole = {
    id: uuid,
    roleName: 'Role name',
    permissions: [],
  };

  const createDto: CreateRoleDto = {
    roleName: 'Role name',
    permissions: [],
  };

  const updateDto: UpdateRoleDto = {
    roleName: 'Updated',
    permissions: [],
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockRole),
    findAll: jest.fn().mockResolvedValue({
      data: [mockRole],
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
    }),
    getRolesList: jest.fn().mockResolvedValue([mockRole]),
    findById: jest.fn().mockResolvedValue(mockRole),
    update: jest.fn().mockResolvedValue({
      ...mockRole,
      roleName: 'Updated',
    }),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        { provide: RolesService, useValue: mockService },
        { provide: APP_GUARD, useValue: { canActivate: () => true } },
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    service = module.get<RolesService>(RolesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a role', async () => {
    expect(await controller.createRole(createDto)).toEqual(mockRole);
    expect(service.create).toHaveBeenCalledWith(createDto);
  });

  it('should return paginated roles', async () => {
    const result = await controller.findAll({ page: 1, limit: 10 }, '');
    expect(result.data).toEqual([mockRole]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a role by id', async () => {
    expect(await controller.findOne(uuid)).toEqual(mockRole);
    expect(service.findById).toHaveBeenCalledWith(uuid);
  });

  it('should update a role', async () => {
    expect(await controller.updateRole(uuid, updateDto)).toEqual({
      ...mockRole,
      roleName: 'Updated',
    });
    expect(service.update).toHaveBeenCalledWith(uuid, updateDto);
  });

  // Error handling tests
  it('should throw ConflictException if role already exists on create', async () => {
    mockService.create.mockRejectedValueOnce(
      new ConflictException('Role already exists'),
    );
    await expect(controller.createRole(createDto)).rejects.toThrow(
      ConflictException,
    );
  });

  it('should throw NotFoundException if role not found on update', async () => {
    mockService.update.mockRejectedValueOnce(
      new NotFoundException('Not found'),
    );
    await expect(controller.updateRole(uuidv4(), updateDto)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw ConflictException if role name already exists on update', async () => {
    mockService.update.mockRejectedValueOnce(
      new ConflictException('Role name exists'),
    );
    await expect(controller.updateRole(uuidv4(), updateDto)).rejects.toThrow(
      ConflictException,
    );
  });

  it('should throw NotFoundException if role not found on findOne', async () => {
    mockService.findById.mockRejectedValueOnce(
      new NotFoundException('Not found'),
    );
    await expect(controller.findOne(uuidv4())).rejects.toThrow(
      NotFoundException,
    );
  });
});
