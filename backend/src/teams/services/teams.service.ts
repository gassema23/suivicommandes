import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';

import { Team } from '../entities/team.entity';
import { User } from '../../users/entities/user.entity';
import { CreateTeamDto } from '../dto/create-team.dto';
import { UpdateTeamDto } from '../dto/update-team.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
import { instanceToPlain } from 'class-transformer';

type TeamWithVirtuals = Team & {
  memberCount: number;
  owner: Partial<User> | undefined;
};

@Injectable()
export class TeamsService {
  /**
   * Service for managing teams.
   * It provides methods to create, update, delete, and retrieve teams,
   * as well as manage team members.
   */
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Crée une nouvelle équipe.
   * @param createTeamDto - DTO contenant les informations de l'équipe à créer.
   * @param createdBy - L'ID de l'utilisateur qui crée l'équipe.
   * @returns La promesse contenant l'équipe créée.
   * @throws BadRequestException si une équipe avec le même propriétaire existe déjà
   * ou si le propriétaire spécifié n'existe pas.
   */
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
        'Impossible de créer : une équipe avec ce propriétaire existe déjà.',
      );
    }

    const owner = await this.userRepository.findOne({
      where: { id: createTeamDto.ownerId },
    });

    if (!owner) {
      throw new BadRequestException(
        "Impossible de créer : propriétaire d'équipe introuvable avec cet identifiant.",
      );
    }

    const team = this.teamRepository.create({
      ...createTeamDto,
      owner,
      createdBy: { id: createdBy } as User,
    });

    return this.teamRepository.save(team);
  }

  /**
   * Récupère une liste paginée d'équipes avec une option de recherche.
   * @param paginationDto - DTO pour la pagination et le tri.
   * @param search - Terme de recherche optionnel pour filtrer les équipes par nom.
   * @returns Un objet contenant les équipes et les métadonnées de pagination.
   */
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

  /**
   * Récupère une équipe par son ID.
   * @param id - L'ID de l'équipe à récupérer.
   * @returns Une promesse contenant l'équipe avec ses propriétés virtuelles.
   * @throws NotFoundException si l'équipe n'existe pas.
   */
  async findOne(id: string): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { id },
      relations: ['owner', 'users', 'createdBy', 'updatedBy'],
    });

    if (!team) {
      throw new NotFoundException(
        'Impossible de trouver : aucune équipe trouvée avec cet identifiant.',
      );
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

  /**
   * Met à jour une équipe par son ID.
   * @param id - L'ID de l'équipe à mettre à jour.
   * @param updateTeamDto - Les données de mise à jour de l'équipe.
   * @param updatedBy - L'ID de l'utilisateur qui met à jour l'équipe.
   * @returns La promesse contenant l'équipe mise à jour.
   * @throws NotFoundException si l'équipe n'existe pas.
   * @throws BadRequestException si le propriétaire spécifié n'existe pas.
   */
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
        throw new BadRequestException(
          "Impossible de modifier : propriétaire d'équipe introuvable avec cet identifiant.",
        );
      }
      team.owner = owner;
    }

    Object.assign(team, updateTeamDto);
    team.updatedBy = { id: updatedBy } as User;

    return this.teamRepository.save(team);
  }

  /**
   * Récupère la liste des équipes avec leurs noms et IDs.
   * @returns Une promesse contenant la liste des équipes.
   */
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

  /**
   * Supprime une équipe par son ID.
   * @param id - L'ID de l'équipe à supprimer.
   * @param deletedBy - L'ID de l'utilisateur qui supprime l'équipe.
   * @throws BadRequestException si l'équipe contient encore des utilisateurs.
   */
  async remove(id: string, deletedBy: string): Promise<void> {
    const team = await this.findOne(id);
    // Vérifier s'il y a des utilisateurs dans l'équipe
    if (team.users && team.users.length > 0) {
      throw new BadRequestException(
        "Impossible de supprimer : l'équipe contient encore des utilisateurs.",
      );
    }

    team.deletedBy = { id: deletedBy } as User;
    await this.teamRepository.save(team);
    await this.teamRepository.softDelete(id);
  }

  /**
   * Ajoute un utilisateur à une équipe.
   * @param teamId - L'ID de l'équipe à laquelle on veut ajouter l'utilisateur.
   * @param userId - L'ID de l'utilisateur à ajouter à l'équipe.
   * @throws BadRequestException si l'utilisateur est déjà dans une équipe ou si l'équipe n'existe pas.
   */
  async addUserToTeam(teamId: string, userId: string): Promise<void> {
    const [team, user] = await Promise.all([
      this.findOne(teamId),
      this.userRepository.findOne({ where: { id: userId } }),
    ]);

    if (!user) {
      throw new BadRequestException(
        "Impossible d'ajouter : utilisateur introuvable avec cet identifiant.",
      );
    }

    if (user.team?.id) {
      throw new BadRequestException(
        "Impossible d'ajouter : l'utilisateur fait déjà partie d'une équipe.",
      );
    }

    user.team = team;
    await this.userRepository.save(user);
  }

  /**
   * Retire un utilisateur d'une équipe.
   * @param teamId - L'ID de l'équipe dont on veut retirer l'utilisateur.
   * @param userId - L'ID de l'utilisateur à retirer de l'équipe.
   * @throws NotFoundException si l'utilisateur n'est pas trouvé dans l'équipe.
   */
  async removeUserFromTeam(teamId: string, userId: string): Promise<void> {
    const [team, user] = await Promise.all([
      this.findOne(teamId),
      this.userRepository.findOne({
        where: { id: userId, team: { id: teamId } },
      }),
    ]);

    if (!user) {
      throw new NotFoundException(
        'Impossible de retirer : utilisateur non trouvé dans cette équipe.',
      );
    }

    user.team = undefined;
    await this.userRepository.save(user);
  }

  /**
   * Récupère les membres d'une équipe par son ID.
   * @param teamId - L'ID de l'équipe dont on veut récupérer les membres.
   * @returns Une promesse contenant la liste des utilisateurs de l'équipe.
   * @throws NotFoundException si l'équipe n'existe pas.
   */
  async getTeamMembers(teamId: string): Promise<User[]> {
    await this.findOne(teamId);

    return this.userRepository.find({
      where: { team: { id: teamId } },
      order: { firstName: 'ASC' },
    });
  }
}
