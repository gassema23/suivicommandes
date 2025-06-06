import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';

import { Team } from './entities/team.entity';
import { User } from '../users/entities/user.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { instanceToPlain } from 'class-transformer';

type TeamWithVirtuals = Team & {
  memberCount: number;
  owner: Partial<User> | undefined;
};

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createTeamDto: CreateTeamDto, createdBy: string): Promise<Team> {
    const existing = await this.teamRepository.findOne({
      where: {
        owner: {
          id: createTeamDto.ownerId,
        },
      },
      relations: ['owner'],
    });

    if (existing) {
      throw new BadRequestException(
        'Une équipe avec ce propriétaire existe déjà',
      );
    }

    const owner = await this.userRepository.findOne({
      where: { id: createTeamDto.ownerId },
    });

    if (!owner) {
      throw new BadRequestException('Utilisateur introuvable');
    }

    const team = this.teamRepository.create({
      ...createTeamDto,
      owner,
      createdBy: { id: createdBy } as User,
    });

    return this.teamRepository.save(team);
  }

  async findAll(
    paginationDto: PaginationDto,
    search?: string,
  ): Promise<PaginatedResult<Team>> {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'DESC',
    } = paginationDto;

    const skip = (page - 1) * limit;

    // Sinon, tri classique
    const whereCondition: FindOptionsWhere<Team> = {};
    if (search) {
      whereCondition.teamName = ILike(`%${search}%`);
    }

    const orderBy: Record<string, 'ASC' | 'DESC'> = {};
    if (sort) {
      orderBy[sort] = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    }

    const [teams, total] = await this.teamRepository.findAndCount({
      where: whereCondition,
      relations: ['createdBy', 'owner'],
      skip,
      take: limit,
      order: orderBy,
    });

    return {
      data: teams,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { id },
      relations: ['owner', 'users', 'createdBy', 'updatedBy'],
    });

    if (!team) {
      throw new NotFoundException('Équipe non trouvée');
    }
    // Ajoute les propriétés virtuelles
    const teamWithVirtuals: TeamWithVirtuals = {
      ...team,
      owner: team.owner
        ? (instanceToPlain(team.owner) as Partial<User>)
        : undefined,
      memberCount: team.users ? team.users.length : 0,
    };

    return teamWithVirtuals;
  }

  async update(
    id: string,
    updateTeamDto: UpdateTeamDto,
    updatedBy: string,
  ): Promise<Team> {
    
    const team = await this.findOne(id);

    if (updateTeamDto.ownerId) {
      const owner = await this.userRepository.findOne({
        where: { id: updateTeamDto.ownerId },
      });

      if (!owner) {
        throw new BadRequestException('Utilisateur introuvable');
      }
      team.owner = owner;
    }

    Object.assign(team, updateTeamDto);
    team.updatedBy = { id: updatedBy } as User;

    return this.teamRepository.save(team);
  }

  async getTeamsList(): Promise<Team[]> {
    const teams = await this.teamRepository.find({
      select: {
        id: true,
        teamName: true,
      },
      order: { teamName: 'ASC' },
    });
    return teams;
  }

  async remove(id: string, deletedBy: string): Promise<void> {
    const team = await this.findOne(id);
    // Vérifier s'il y a des utilisateurs dans l'équipe
    if (team.users && team.users.length > 0) {
      throw new BadRequestException(
        'Impossible de supprimer une équipe qui contient des utilisateurs',
      );
    }

    team.deletedBy = { id: deletedBy } as User;
    await this.teamRepository.save(team);
    await this.teamRepository.softDelete(id);
  }

  async addUserToTeam(teamId: string, userId: string): Promise<void> {
    const [team, user] = await Promise.all([
      this.findOne(teamId),
      this.userRepository.findOne({ where: { id: userId } }),
    ]);

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    if (user.team?.id) {
      throw new BadRequestException(
        "L'utilisateur fait déjà partie d'une équipe",
      );
    }

    user.team = team;
    await this.userRepository.save(user);
  }

  async removeUserFromTeam(teamId: string, userId: string): Promise<void> {
    const [team, user] = await Promise.all([
      this.findOne(teamId),
      this.userRepository.findOne({
        where: { id: userId, team: { id: teamId } },
      }),
    ]);

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé dans cette équipe');
    }

    user.team = undefined;
    await this.userRepository.save(user);
  }

  async getTeamMembers(teamId: string): Promise<User[]> {
    await this.findOne(teamId);

    return this.userRepository.find({
      where: { team: { id: teamId } },
      order: { firstName: 'ASC' },
    });
  }
}
