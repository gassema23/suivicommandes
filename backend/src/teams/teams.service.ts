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
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
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
    const existingTeam = await this.teamRepository.findOne({
      where: { teamName: createTeamDto.teamName },
    });
    if (existingTeam) {
      throw new BadRequestException('Une équipe avec ce nom existe déjà');
    }

    const team = this.teamRepository.create({
      ...createTeamDto,
      createdBy: { id: createdBy } as User,
    });

    return this.teamRepository.save(team);
  }

  async findAll(
    paginationDto: PaginationDto,
    search?: string,
  ): Promise<PaginatedResult<TeamWithVirtuals>> {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'DESC',
    } = paginationDto;
    const skip = (page - 1) * limit;

    // Si on veut trier par le nom du propriétaire
    if (sort?.toLowerCase() === 'ownerid') {
      const qb = this.teamRepository
        .createQueryBuilder('team')
        .leftJoinAndSelect('team.owner', 'owner')
        .leftJoinAndSelect('team.users', 'users')
        .leftJoinAndSelect('team.createdBy', 'createdBy')
        .skip(skip)
        .take(limit);

      if (search) {
        qb.where('team.teamName ILIKE :search', { search: `%${search}%` });
      }

      // Trie sur le nom complet du propriétaire
      qb.orderBy({
        'owner.firstName': order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
        'owner.lastName': order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
      });

      const [teams, total] = await qb.getManyAndCount();

      const teamsWithVirtuals: TeamWithVirtuals[] = teams.map((team) => ({
        ...team,
        owner: team.owner
          ? (instanceToPlain(team.owner) as Partial<User>)
          : undefined,
        memberCount: team.users ? team.users.length : 0,
      }));

      return {
        data: teamsWithVirtuals,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }

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
      relations: ['owner', 'users', 'createdBy'],
      skip,
      take: limit,
      order: orderBy,
    });

    const teamsWithVirtuals: TeamWithVirtuals[] = teams.map((team) => ({
      ...team,
      owner: team.owner
        ? (instanceToPlain(team.owner) as Partial<User>)
        : undefined,
      memberCount: team.users ? team.users.length : 0,
    }));

    return {
      data: teamsWithVirtuals,
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
    if (updateTeamDto.teamName && updateTeamDto.teamName !== team.teamName) {
      const existingTeam = await this.teamRepository.findOne({
        where: { teamName: updateTeamDto.teamName },
      });
      if (existingTeam) {
        throw new BadRequestException('Une équipe avec ce nom existe déjà');
      }
    }

    if (
      updateTeamDto.ownerId &&
      (!team.owner || team.owner.id !== updateTeamDto.ownerId)
    ) {
      const newOwner = await this.userRepository.findOne({
        where: { id: updateTeamDto.ownerId },
      });
      if (!newOwner) {
        throw new BadRequestException('Propriétaire introuvable');
      }
      team.owner = newOwner;
    }

    Object.assign(team, updateTeamDto, {
      updatedBy: { id: updatedBy } as User,
    });

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
