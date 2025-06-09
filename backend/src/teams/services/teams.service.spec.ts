import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Team } from '../entities/team.entity';
import { User } from '../../users/entities/user.entity';
import { TeamsService } from './teams.service';

const mockTeam = {
  id: 'uuid-team',
  teamName: 'Test team',
  users: [],
  owner: { id: 'uuid-owner' },
};

const mockUser = {
  id: 'uuid-user',
  firstName: 'John',
  team: undefined,
};

describe('TeamsService', () => {
  let service: TeamsService;
  let teamRepo: Repository<Team>;
  let userRepo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamsService,
        {
          provide: getRepositoryToken(Team),
          useValue: {
            findAndCount: jest.fn().mockResolvedValue([[mockTeam], 1]),
            find: jest.fn().mockResolvedValue([mockTeam]),
            findOne: jest.fn(),
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn().mockImplementation((team) => team),
            softDelete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn().mockResolvedValue([mockUser]),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TeamsService>(TeamsService);
    teamRepo = module.get<Repository<Team>>(getRepositoryToken(Team));
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return paginated teams', async () => {
    const result = await service.findAll({ page: 1, limit: 10 });
    expect(result.data).toEqual([mockTeam]);
    expect(result.meta.total).toBe(1);
  });

  it('should create a team', async () => {
    (teamRepo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    (userRepo.findOne as jest.Mock).mockResolvedValueOnce({ id: 'uuid-owner' });
    const dto = {
      teamName: 'Test team',
      ownerId: 'uuid-owner',
    };
    const created = await service.create(dto as any, 'user-team');
    expect(created.teamName).toBe('Test team');
    expect(teamRepo.create).toHaveBeenCalled();
    expect(teamRepo.save).toHaveBeenCalled();
  });

  it('should throw if team already exists on create', async () => {
    (teamRepo.findOne as jest.Mock).mockResolvedValueOnce(mockTeam);
    await expect(
      service.create(
        {
          teamName: 'Test team',
          ownerId: 'uuid-owner',
        } as any,
        'user-team',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should find one team', async () => {
    (teamRepo.findOne as jest.Mock).mockResolvedValueOnce(mockTeam);
    const team = await service.findOne('uuid-team');
    expect(team).toEqual(expect.objectContaining({ id: 'uuid-team' }));
  });

  it('should throw if team not found', async () => {
    (teamRepo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(service.findOne('not-exist')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update a team', async () => {
    (teamRepo.findOne as jest.Mock).mockResolvedValueOnce(mockTeam); // findOne for findOne(id)
    (userRepo.findOne as jest.Mock).mockResolvedValueOnce({ id: 'uuid-owner' }); // findOne for owner
    const updated = await service.update(
      'uuid-team',
      {
        teamName: 'New Name',
        ownerId: 'uuid-owner',
      } as any,
      'user-team',
    );
    expect(updated.teamName).toBe('New Name');
    expect(teamRepo.save).toHaveBeenCalled();
  });

  it('should remove a team', async () => {
    (teamRepo.findOne as jest.Mock).mockResolvedValueOnce({
      ...mockTeam,
      users: [],
    });
    await expect(
      service.remove('uuid-team', 'user-team'),
    ).resolves.toBeUndefined();
    expect(teamRepo.save).toHaveBeenCalled();
    expect(teamRepo.softDelete).toHaveBeenCalledWith('uuid-team');
  });

  it('should throw if team not found on remove', async () => {
    (teamRepo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(service.remove('not-exist', 'user-team')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw if team has users on remove', async () => {
    (teamRepo.findOne as jest.Mock).mockResolvedValueOnce({
      ...mockTeam,
      users: [{ id: 'user1' }],
    });
    await expect(service.remove('uuid-team', 'user-team')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should get teams list', async () => {
    (teamRepo.find as jest.Mock).mockResolvedValueOnce([mockTeam]);
    const teams = await service.getTeamsList();
    expect(teams).toEqual([mockTeam]);
  });

  it('should add user to team', async () => {
    (teamRepo.findOne as jest.Mock).mockResolvedValueOnce(mockTeam);
    (userRepo.findOne as jest.Mock).mockResolvedValueOnce({
      ...mockUser,
      team: undefined,
    });
    await expect(
      service.addUserToTeam('uuid-team', 'uuid-user'),
    ).resolves.toBeUndefined();
    expect(userRepo.save).toHaveBeenCalled();
  });

  it('should throw if user not found on addUserToTeam', async () => {
    (teamRepo.findOne as jest.Mock).mockResolvedValueOnce(mockTeam);
    (userRepo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(
      service.addUserToTeam('uuid-team', 'uuid-user'),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw if user already in a team on addUserToTeam', async () => {
    (teamRepo.findOne as jest.Mock).mockResolvedValueOnce(mockTeam);
    (userRepo.findOne as jest.Mock).mockResolvedValueOnce({
      ...mockUser,
      team: { id: 'uuid-team' },
    });
    await expect(
      service.addUserToTeam('uuid-team', 'uuid-user'),
    ).rejects.toThrow(BadRequestException);
  });

  it('should remove user from team', async () => {
    (teamRepo.findOne as jest.Mock).mockResolvedValueOnce(mockTeam);
    (userRepo.findOne as jest.Mock).mockResolvedValueOnce({
      ...mockUser,
      team: { id: 'uuid-team' },
    });
    await expect(
      service.removeUserFromTeam('uuid-team', 'uuid-user'),
    ).resolves.toBeUndefined();
    expect(userRepo.save).toHaveBeenCalled();
  });

  it('should throw if user not found in team on removeUserFromTeam', async () => {
    (teamRepo.findOne as jest.Mock).mockResolvedValueOnce(mockTeam);
    (userRepo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(
      service.removeUserFromTeam('uuid-team', 'uuid-user'),
    ).rejects.toThrow(NotFoundException);
  });

  it('should get team members', async () => {
    (teamRepo.findOne as jest.Mock).mockResolvedValueOnce(mockTeam);
    (userRepo.find as jest.Mock).mockResolvedValueOnce([mockUser]);
    const members = await service.getTeamMembers('uuid-team');
    expect(members).toEqual([mockUser]);
  });
});
