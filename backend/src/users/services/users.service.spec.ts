import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UsersService } from './users.service';

const mockUser = {
  id: 'uuid-user',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  password: 'hashedpass',
  team: null,
};

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  beforeEach(async () => {
    const mockQueryBuilder: any = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[mockUser], 1]),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([mockUser]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findAndCount: jest.fn().mockResolvedValue([[mockUser], 1]),
            find: jest.fn().mockResolvedValue([mockUser]),
            findOne: jest.fn(),
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn().mockImplementation((user) => user),
            softDelete: jest.fn(),
            count: jest.fn().mockResolvedValue(1),
            createQueryBuilder: jest.fn(() => mockQueryBuilder),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return paginated users', async () => {
    const result = await service.findAll({ page: 1, limit: 10 });
    expect(result.data).toEqual([mockUser]);
    expect(result.meta.total).toBe(1);
  });

  it('should create a user', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    (repo.save as jest.Mock).mockResolvedValueOnce(mockUser);
    const dto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };
    const created = await service.create(dto, 'user-creator');
    expect(created.firstName).toBe('John');
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if user already exists on create', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockUser);
    await expect(
      service.create(
        {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password: 'password123',
        },
        'user-creator',
      ),
    ).rejects.toThrow(ConflictException);
  });

  it('should find one user', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockUser);
    const user = await service.findOne('uuid-user');
    expect(user).toEqual(mockUser);
  });

  it('should throw if user not found', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(service.findOne('not-exist')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update a user', async () => {
    (repo.findOne as jest.Mock)
      .mockResolvedValueOnce(mockUser) // findOne for findOne(id)
      .mockResolvedValueOnce(undefined); // findOne for duplicate email check
    const updated = await service.update(
      'uuid-user',
      {
        firstName: 'Jane',
        email: 'jane.doe@example.com',
      } as any,
      'user-updater',
    );
    expect(updated.firstName).toBe('Jane');
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if updated email already exists', async () => {
    (repo.findOne as jest.Mock)
      .mockResolvedValueOnce(mockUser) // findOne for findOne(id)
      .mockResolvedValueOnce(mockUser); // findOne for duplicate email check
    await expect(
      service.update(
        'uuid-user',
        {
          email: 'john.doe@example.com',
        } as any,
        'user-updater',
      ),
    ).rejects.toThrow(ConflictException);
  });

  it('should remove a user', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockUser);
    await expect(
      service.remove('uuid-user', 'user-deleter'),
    ).resolves.toBeUndefined();
    expect(repo.save).toHaveBeenCalled();
    expect(repo.softDelete).toHaveBeenCalledWith('uuid-user');
  });

  it('should throw if user not found on remove', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(service.remove('not-exist', 'user-deleter')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update profile image', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockUser);
    (repo.save as jest.Mock).mockResolvedValueOnce({
      ...mockUser,
      profileImage: 'url',
    });
    const updated = await service.updateProfileImage('uuid-user', 'url');
    expect(updated.profileImage).toBe('url');
    expect(repo.save).toHaveBeenCalled();
  });

  it('should search users', async () => {
    const users = await service.searchUsers('john');
    expect(users).toEqual([mockUser]);
  });

  it('should get users by team', async () => {
    (repo.find as jest.Mock).mockResolvedValueOnce([mockUser]);
    const users = await service.getUsersByTeam('uuid-team');
    expect(users).toEqual([mockUser]);
  });

  it('should get user stats', async () => {
    (repo.count as jest.Mock)
      .mockResolvedValueOnce(10) // totalUsers
      .mockResolvedValueOnce(7) // verifiedUsers
      .mockResolvedValueOnce(5); // usersWithTeams
    const stats = await service.getUserStats();
    expect(stats).toEqual({
      totalUsers: 10,
      verifiedUsers: 7,
      usersWithTeams: 5,
      unverifiedUsers: 3,
    });
  });
});
