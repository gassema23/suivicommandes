import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { RolesService } from './roles.service';

const mockRole = {
  id: 'uuid-role',
  roleName: 'Test role',
  permissions: [],
};

describe('RolesService', () => {
  let service: RolesService;
  let roleRepo: Repository<Role>;
  let permissionRepo: Repository<Permission>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: getRepositoryToken(Role),
          useValue: {
            findAndCount: jest.fn().mockResolvedValue([[mockRole], 1]),
            find: jest.fn().mockResolvedValue([mockRole]),
            findOne: jest.fn(),
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn().mockImplementation((entity) => entity),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Permission),
          useValue: {
            create: jest.fn().mockImplementation((dto) => dto),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    roleRepo = module.get<Repository<Role>>(getRepositoryToken(Role));
    permissionRepo = module.get<Repository<Permission>>(
      getRepositoryToken(Permission),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return paginated roles', async () => {
    const result = await service.findAll({ page: 1, limit: 10 });
    expect(result.data).toEqual([mockRole]);
    expect(result.meta.total).toBe(1);
  });

  it('should create a role', async () => {
    (roleRepo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    const dto = { roleName: 'Test role', permissions: [] };
    const created = await service.create(dto);
    expect(created.roleName).toBe('Test role');
    expect(roleRepo.create).toHaveBeenCalled();
    expect(roleRepo.save).toHaveBeenCalled();
  });

  it('should throw if role already exists on create', async () => {
    (roleRepo.findOne as jest.Mock).mockResolvedValueOnce(mockRole);
    await expect(
      service.create({ roleName: 'Test role', permissions: [] }),
    ).rejects.toThrow(ConflictException);
  });

  it('should update a role', async () => {
    (roleRepo.findOne as jest.Mock)
      .mockResolvedValueOnce(mockRole) // findOne for findOne(id)
      .mockResolvedValueOnce(undefined); // findOne for duplicate check
    const updated = await service.update('uuid-role', {
      roleName: 'New Name',
      permissions: [],
    });
    expect(updated.roleName).toBe('New Name');
    expect(roleRepo.save).toHaveBeenCalled();
  });

  it('should throw if updated role name already exists', async () => {
    (roleRepo.findOne as jest.Mock)
      .mockResolvedValueOnce(mockRole) // findOne for findOne(id)
      .mockResolvedValueOnce(mockRole); // findOne for duplicate check
    await expect(
      service.update('uuid-role', { roleName: 'Test role', permissions: [] }),
    ).rejects.toThrow(ConflictException);
  });

  it('should throw if role not found on update', async () => {
    (roleRepo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(
      service.update('not-exist', { roleName: 'X', permissions: [] }),
    ).rejects.toThrow(NotFoundException);
  });
});
