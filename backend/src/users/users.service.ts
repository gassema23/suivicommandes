import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindOptionsWhere,
  ILike,
  IsNull,
  Not,
  In,
  And,
  Raw,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

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
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
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

  async findAll(
    paginationDto: PaginationDto,
    search?: string,
  ): Promise<PaginatedResult<User>> {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'DESC',
      startsWith,
    } = paginationDto;

    const skip = (page - 1) * limit;

    // Helper pour construire les conditions alphabétiques sur fullName
    const buildFullNameAlphabetFilter = (qb: any) => {
      if (!startsWith) return;

      const ranges = {
        'A-E': ['A', 'E'],
        'F-J': ['F', 'J'],
        'K-O': ['K', 'O'],
        'P-T': ['P', 'T'],
        'U-Z': ['U', 'Z'],
      };

      const range = ranges[startsWith as keyof typeof ranges];
      if (!range) return;

      const [start, end] = range;

      // Filtrer sur le fullName concaténé (firstName + ' ' + lastName)
      qb.andWhere(
        "UPPER(CONCAT(user.firstName, ' ', user.lastName)) >= :start AND UPPER(CONCAT(user.firstName, ' ', user.lastName)) <= :endZ",
        {
          start: start,
          endZ: end + 'Z',
        },
      );
    };

    // Utiliser toujours le query builder pour avoir plus de contrôle
    const qb = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.team', 'team')
      .leftJoinAndSelect('user.createdBy', 'createdBy')
      .skip(skip)
      .take(limit);

    // Filtre de recherche textuelle sur fullName
    if (search) {
      qb.where("CONCAT(user.firstName, ' ', user.lastName) ILIKE :search", {
        search: `%${search}%`,
      });
    }

    // Filtre alphabétique sur fullName
    buildFullNameAlphabetFilter(qb);

    // Tri - toujours par fullName pour la cohérence
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
      // Pour tout autre champ de tri
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
        startsWith, // Inclure dans la réponse pour le frontend
      },
    };
  }

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

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['team', 'createdBy', 'updatedBy'],
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['team'],
    });
  }

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
          'Un utilisateur avec cet email existe déjà',
        );
      }
    }

    // Mettre à jour les champs
    Object.assign(user, updateUserDto, {
      updatedBy: updatedBy ? ({ id: updatedBy } as User) : undefined,
    });

    return this.userRepository.save(user);
  }

  async remove(id: string, deletedBy?: string): Promise<void> {
    const user = await this.findOne(id);

    user.deletedBy = deletedBy ? ({ id: deletedBy } as User) : undefined;
    await this.userRepository.save(user);
    await this.userRepository.softDelete(id);
  }

  async updateProfileImage(id: string, imageUrl: string): Promise<User> {
    const user = await this.findOne(id);
    user.profileImage = imageUrl;
    return this.userRepository.save(user);
  }

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

  async getUsersByTeam(teamId: string): Promise<User[]> {
    return this.userRepository.find({
      where: { teamId },
      relations: ['team'],
      order: { firstName: 'ASC' },
    });
  }

  async getUserStats() {
    const [totalUsers, verifiedUsers, usersWithTeams] = await Promise.all([
      this.userRepository.count(),
      // Correction: utilisation correcte de Not avec IsNull
      this.userRepository.count({ where: { emailVerifiedAt: Not(IsNull()) } }),
      this.userRepository.count({ where: { teamId: Not(IsNull()) } }),
    ]);

    return {
      totalUsers,
      verifiedUsers,
      usersWithTeams,
      unverifiedUsers: totalUsers - verifiedUsers,
    };
  }
}
