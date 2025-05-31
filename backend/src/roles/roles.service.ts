import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { FindOptionsWhere, ILike, Not, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { User } from 'src/users/entities/user.entity';
import { Permission } from './entities/permission.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(role: CreateRoleDto): Promise<Role> {
    const existingRole = await this.roleRepository.findOne({
      where: { roleName: role.roleName },
    });
    if (existingRole) {
      throw new ConflictException('Un role avec cet nom existe déjà');
    }

    const newRole = this.roleRepository.create(role);

    return this.roleRepository.save(newRole);
  }

  async findById(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
    if (!role) {
      throw new ConflictException('Role not found');
    }

    return role;
  }

  async findAll(
    paginationDto: PaginationDto,
    search?: string,
  ): Promise<PaginatedResult<Role>> {
    const {
      page = 1,
      limit = 10,
      sort = 'roleName',
      order = 'ASC',
    } = paginationDto;
    const skip = (page - 1) * limit;

    // Sinon, tri classique sur une colonne physique
    const whereCondition: FindOptionsWhere<User> = {};
    if (search) {
      whereCondition.firstName = ILike(`%${search}%`);
    }

    const orderBy: Record<string, 'ASC' | 'DESC'> = {};
    if (sort) {
      orderBy[sort] = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    }

    const [roles, total] = await this.roleRepository.findAndCount({
      where: whereCondition,
      relations: ['permissions', 'createdBy'],
      skip,
      take: limit,
      order: orderBy,
    });
    return {
      data: roles,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getRolesList(): Promise<Role[]> {
    return this.roleRepository.find({
      select: ['id', 'roleName'],
      order: { roleName: 'ASC' },
    });
  }

  async update(id: string, roleDto: CreateRoleDto): Promise<Role> {
    const existingRole = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });

    if (!existingRole) {
      throw new ConflictException('Role not found');
    }

    // Vérifier si le nom du rôle est déjà utilisé par un autre rôle
    const roleWithSameName = await this.roleRepository.findOne({
      where: { roleName: roleDto.roleName, id: Not(id) },
    });
    if (roleWithSameName) {
      throw new ConflictException('Un rôle avec ce nom existe déjà');
    }
    // Mettre à jour les propriétés simples
    existingRole.roleName = roleDto.roleName;

    // Synchroniser les permissions (type "sync" Laravel)
    // 1. Supprimer toutes les permissions existantes
    if (existingRole.permissions && existingRole.permissions.length > 0) {
      await this.permissionRepository.remove(existingRole.permissions);
      existingRole.permissions = [];
      await this.roleRepository.save(existingRole);
    }

    // 2. Ajouter les nouvelles permissions
    if (roleDto.permissions && roleDto.permissions.length > 0) {
      const newPermissions = roleDto.permissions.map((perm) =>
        this.permissionRepository.create({ ...perm, role: existingRole }),
      );
      existingRole.permissions = newPermissions;
    }

    return this.roleRepository.save(existingRole);
  }
}
