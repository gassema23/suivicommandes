import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, IsNull, Not, In } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Injectable()
export class UsersService {
  /**
   * Service pour gérer les utilisateurs, y compris les opérations CRUD et la pagination.
   * @param userRepository - Repository pour l'entité User.
   */
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Crée un nouvel utilisateur.
   * @param createUserDto - DTO contenant les informations de l'utilisateur à créer.
   * @param createdBy - ID de l'utilisateur qui crée le nouvel utilisateur (optionnel).
   * @returns La promesse contenant l'utilisateur créé.
   * @throws ConflictException si un utilisateur avec le même email existe déjà.
   */
  async create(
    createUserDto: CreateUserDto,
    createdBy?: string,
  ): Promise<User> {
    const { email, password, ...userData } = createUserDto;

    // Vérifier si l'email existe déjà
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException(
        'Impossible de créer : un utilisateur avec cette adresse email existe déjà.',
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer l'utilisateur
    const user = this.userRepository.create({
      ...userData,
      email,
      password: hashedPassword,
      createdBy: createdBy ? ({ id: createdBy } as User) : undefined,
    });

    return this.userRepository.save(user);
  }

  /**
   * Récupère une liste paginée d'utilisateurs avec une option de recherche.
   * @param paginationDto - DTO pour la pagination et le tri.
   * @param search - Terme de recherche optionnel pour filtrer les utilisateurs par nom complet.
   * @returns Un objet contenant les utilisateurs et les métadonnées de pagination.
   */
  async findAll(
    paginationDto: PaginationDto,
    search?: string,
  ): Promise<PaginatedResult<User>> {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'DESC',
    } = paginationDto;

    const skip = (page - 1) * limit;

    const qb = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.team', 'team')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.createdBy', 'createdBy')
      .skip(skip)
      .take(limit);

    // Filtre de recherche textuelle sur fullName
    if (search) {
      qb.where("CONCAT(user.firstName, ' ', user.lastName) ILIKE :search", {
        search: `%${search}%`,
      });
    }

    if (
      sort?.toLowerCase() === 'fullname' ||
      sort?.toLowerCase() === 'createdAt'
    ) {
      if (sort?.toLowerCase() === 'fullname') {
        qb.orderBy({
          'user.firstName': order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
          'user.lastName': order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
        });
      } else {
        qb.orderBy(
          `user.${sort}`,
          order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
        );
      }
    } else {
      qb.orderBy(
        `user.${sort}`,
        order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
      );
    }

    const [users, total] = await qb.getManyAndCount();

    return {
      data: users,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Récupère une liste d'utilisateurs avec leurs ID et noms complets, filtrée par rôle.
   * @param role - Le rôle des utilisateurs à récupérer (peut être une chaîne ou un tableau de chaînes).
   * @returns Une liste d'objets contenant l'ID et le nom complet des utilisateurs.
   */
  async getUsersList(
    role?: string | string[],
  ): Promise<{ id: string; fullName: string }[]> {
    const where: FindOptionsWhere<User> = {};
    if (role) {
      let roles: string[];
      if (Array.isArray(role)) {
        roles = role;
      } else if (
        typeof role === 'string' &&
        (role.includes(',') || role.includes('.'))
      ) {
        roles = role
          .split(/[,.]/)
          .map((r) => r.trim())
          .filter(Boolean);
      } else {
        roles = [role];
      }
      if (roles.length > 1) {
        where.role = { roleName: In(roles) };
      } else {
        where.role = { roleName: roles[0] };
      }
    }

    const users = await this.userRepository.find({
      select: ['id', 'firstName', 'lastName'],
      where,
      order: { firstName: 'ASC' },
      relations: ['role'],
    });

    return users.map((user) => ({
      id: user.id,
      fullName: `${user.firstName} ${user.lastName}`.trim(),
    }));
  }

  /**
   * Récupère un utilisateur par son ID.
   * @param id - L'ID de l'utilisateur à récupérer.
   * @returns L'utilisateur correspondant à l'ID, ou une exception si non trouvé.
   * @throws NotFoundException si l'utilisateur n'existe pas.
   */
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['team', 'createdBy', 'updatedBy'],
    });
    if (!user) {
      throw new NotFoundException(
        'Impossible de trouver : aucun utilisateur trouvé avec cet identifiant.',
      );
    }
    return user;
  }

  /**
   * Recherche un utilisateur par son email.
   * @param email - L'email de l'utilisateur à rechercher.
   * @returns L'utilisateur correspondant à l'email, ou null si aucun utilisateur n'est trouvé.
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['team'],
    });
  }

  /**
   * Met à jour un utilisateur existant.
   * @param id - ID de l'utilisateur à mettre à jour.
   * @param updateUserDto - DTO contenant les données de mise à jour.
   * @param updatedBy - ID de l'utilisateur qui effectue la mise à jour (optionnel).
   * @returns L'utilisateur mis à jour.
   * @throws NotFoundException si l'utilisateur n'existe pas.
   * @throws ConflictException si l'email est déjà utilisé par un autre utilisateur.
   */
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    updatedBy?: string,
  ): Promise<User> {
    const user = await this.findOne(id);

    // Vérifier l'unicité de l'email si modifié
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingUser) {
        throw new ConflictException(
          'Impossible de modifier : un utilisateur avec cette adresse email existe déjà.',
        );
      }
    }

    // Mettre à jour les champs
    Object.assign(user, updateUserDto, {
      updatedBy: updatedBy ? ({ id: updatedBy } as User) : undefined,
    });

    return this.userRepository.save(user);
  }

  /**
   * Supprime un utilisateur par son ID.
   * @param id - ID de l'utilisateur à supprimer.
   * @param deletedBy - ID de l'utilisateur qui effectue la suppression (optionnel).
   * @returns Une promesse qui se résout lorsque l'utilisateur est supprimé.
   */
  async remove(id: string, deletedBy?: string): Promise<void> {
    const user = await this.findOne(id);

    user.deletedBy = deletedBy ? ({ id: deletedBy } as User) : undefined;
    await this.userRepository.save(user);
    await this.userRepository.softDelete(id);
  }

  /**
   * Met à jour l'image de profil d'un utilisateur.
   * @param id - ID de l'utilisateur dont on veut mettre à jour l'image de profil.
   * @param imageUrl - URL de la nouvelle image de profil.
   * @returns L'utilisateur mis à jour avec la nouvelle image de profil.
   */
  async updateProfileImage(id: string, imageUrl: string): Promise<User> {
    const user = await this.findOne(id);
    user.profileImage = imageUrl;
    return this.userRepository.save(user);
  }

  /**
   * Recherche des utilisateurs par nom, prénom ou email.
   * @param search - Chaîne de recherche pour filtrer les utilisateurs.
   * @param limit - Nombre maximum d'utilisateurs à retourner (par défaut 10).
   * @returns Une liste d'utilisateurs correspondant à la recherche.
   */
  async searchUsers(search: string, limit = 10): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .where(
        'user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search',
        {
          search: `%${search}%`,
        },
      )
      .andWhere('user.emailVerifiedAt IS NOT NULL')
      .limit(limit)
      .getMany();
  }

  /**
   * Récupère les utilisateurs d'une équipe spécifique.
   * @param teamId - ID de l'équipe pour laquelle on veut récupérer les utilisateurs.
   * @returns Une liste d'utilisateurs appartenant à l'équipe spécifiée.
   */
  async getUsersByTeam(teamId: string): Promise<User[]> {
    return this.userRepository.find({
      where: { team: { id: teamId } },
      relations: ['team'],
      order: { firstName: 'ASC' },
    });
  }

  /**
   * Récupère les statistiques des utilisateurs.
   * @returns Un objet contenant les statistiques des utilisateurs.
   */
  async getUserStats() {
    const [totalUsers, verifiedUsers, usersWithTeams] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { emailVerifiedAt: Not(IsNull()) } }),
      this.userRepository.count({ where: { team: { id: Not(IsNull()) } } }),
    ]);

    return {
      totalUsers,
      verifiedUsers,
      usersWithTeams,
      unverifiedUsers: totalUsers - verifiedUsers,
    };
  }
}
