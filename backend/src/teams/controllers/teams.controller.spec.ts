import { Test, TestingModule } from '@nestjs/testing';
import { APP_GUARD } from '@nestjs/core';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from '../services/teams.service';

jest.mock('../../auth/guards/authorizations.guard', () => ({
  AuthorizationsGuard: { canActivate: () => true },
}));

describe('TeamsController', () => {
  let controller: TeamsController;
  let service: TeamsService;

  const userId = uuidv4();
  const uuid = uuidv4();

  const mockTeam = {
    id: uuid,
    teamName: 'Team name',
    users: [],
    owner: { id: 'uuid-owner' },
  };

  const createDto = {
    teamName: 'Team name',
    ownerId: 'uuid-owner',
  };

  const paginatedResult = {
    data: [mockTeam],
    meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockTeam),
    findAll: jest.fn().mockResolvedValue(paginatedResult),
    findOne: jest.fn().mockResolvedValue(mockTeam),
    update: jest.fn().mockResolvedValue({
      ...mockTeam,
      teamName: 'Updated',
    }),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
    getTeamsList: jest.fn().mockResolvedValue([mockTeam]),
    addUserToTeam: jest.fn().mockResolvedValue(undefined),
    removeUserFromTeam: jest.fn().mockResolvedValue(undefined),
    getTeamMembers: jest
      .fn()
      .mockResolvedValue([{ id: 'uuid-user', firstName: 'John' }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamsController],
      providers: [
        { provide: TeamsService, useValue: mockService },
        { provide: APP_GUARD, useValue: { canActivate: () => true } },
      ],
    }).compile();

    controller = module.get<TeamsController>(TeamsController);
    service = module.get<TeamsService>(TeamsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a team', async () => {
    expect(await controller.create(createDto, { id: userId } as any)).toEqual(
      mockTeam,
    );
    expect(service.create).toHaveBeenCalledWith(createDto, userId);
  });

  it('should return all teams', async () => {
    expect(await controller.findAll({})).toEqual({
      ...paginatedResult,
      data: paginatedResult.data.map(() => expect.any(Object)),
    });
  });

  it('should return a team by id', async () => {
    expect(await controller.findOne(uuid)).toEqual(mockTeam);
    expect(service.findOne).toHaveBeenCalledWith(uuid);
  });

  it('should update a team', async () => {
    expect(
      await controller.update(uuid, { teamName: 'Updated' }, {
        id: userId,
      } as any),
    ).toEqual({
      ...mockTeam,
      teamName: 'Updated',
    });
    expect(service.update).toHaveBeenCalledWith(
      uuid,
      { teamName: 'Updated' },
      userId,
    );
  });

  it('should remove a team', async () => {
    expect(await controller.remove(uuid, { id: userId } as any)).toEqual({
      message: 'Équipe supprimée avec succès',
    });
    expect(service.remove).toHaveBeenCalledWith(uuid, userId);
  });

  it('should get teams list', async () => {
    expect(await controller.getTeamsList()).toEqual([mockTeam]);
    expect(service.getTeamsList).toHaveBeenCalled();
  });

  it('should add a member to a team', async () => {
    await expect(controller.addMember(uuid, 'uuid-user')).resolves.toEqual({
      message: "Utilisateur ajouté à l'équipe avec succès",
    });
    expect(service.addUserToTeam).toHaveBeenCalledWith(uuid, 'uuid-user');
  });

  it('should remove a member from a team', async () => {
    await expect(controller.removeMember(uuid, 'uuid-user')).resolves.toEqual({
      message: "Utilisateur retiré de l'équipe avec succès",
    });
    expect(service.removeUserFromTeam).toHaveBeenCalledWith(uuid, 'uuid-user');
  });

  it('should get team members', async () => {
    expect(await controller.getMembers(uuid)).toEqual([
      { id: 'uuid-user', firstName: 'John' },
    ]);
    expect(service.getTeamMembers).toHaveBeenCalledWith(uuid);
  });

  // Error handling tests
  it('should throw NotFoundException if team not found', async () => {
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
      controller.create({ teamName: '', ownerId: '' }, {
        id: userId,
      } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException on update if not found', async () => {
    mockService.update.mockRejectedValueOnce(
      new NotFoundException('Not found'),
    );
    await expect(
      controller.update(uuidv4(), { teamName: 'X' }, {
        id: userId,
      } as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException on invalid update', async () => {
    mockService.update.mockRejectedValueOnce(
      new BadRequestException('Invalid data'),
    );
    await expect(
      controller.update(uuidv4(), { teamName: '' }, {
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
