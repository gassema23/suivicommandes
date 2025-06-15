import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity';
import { FindOptionsWhere, ILike, Not, Repository } from 'typeorm';
import { CreateRoleDto } from '../dto/create-role.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
import { Permission } from '../entities/permission.entity';
import { UpdateRoleDto } from '../dto/update-role.dto';

@Injectable()
export class RolesService {
  /**
   * Service pour gérer les rôles et permissions.
   * Permet de créer, lire, mettre à jour et supprimer des rôles.
   * @param roleRepository - Repository pour l'entité Role.
   * @param permissionRepository - Repository pour l'entité Permission.
   */
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  /**
   * Crée un nouveau rôle.
   * @param role - DTO contenant les informations du rôle à créer.
   * @returns Le rôle créé.
   * @throws ConflictException si un rôle avec le même nom existe déjà.
   */
  async create(role: CreateRoleDto): Promise<Role> {
    const existingRole = await this.roleRepository.findOne({
      where: { roleName: role.roleName },
    });
    if (existingRole) {
      throw new ConflictException(
        'Impossible de créer : un rôle avec ce nom existe déjà.',
      );
    }

    const newRole = this.roleRepository.create(role);

    return this.roleRepository.save(newRole);
  }

  /**
   * Supprime un rôle par son ID.
   * @param id - ID du rôle à supprimer.
   * @returns Le rôle supprimé.
   * @throws NotFoundException si aucun rôle n'est trouvé avec l'ID fourni.
   */
  async findById(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
    if (!role) {
      throw new NotFoundException(
        'Impossible de trouver : aucun rôle trouvé avec cet identifiant.',
      );
    }

    return role;
  }

  /**
   * Récupère tous les rôles avec pagination et recherche.
   * @param paginationDto - DTO de pagination contenant les paramètres de page, limite, tri et ordre.
   * @param search - Termes de recherche pour filtrer les rôles par nom.
   * @returns Un objet PaginatedResult contenant les rôles et les métadonnées de pagination.
   */
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
    const whereCondition: FindOptionsWhere<Role> = {};
    if (search) {
      whereCondition.roleName = ILike(`%${search}%`);
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

  /**
   * Récupère la liste des rôles sans les permissions.
   * @returns Un tableau de rôles avec uniquement les ID et noms.
   */
  async getRolesList(): Promise<Role[]> {
    return this.roleRepository.find({
      select: ['id', 'roleName'],
      order: { roleName: 'ASC' },
    });
  }

  /**
   * Met à jour un rôle existant.
   * @param id - ID du rôle à mettre à jour.
   * @param roleDto - DTO contenant les nouvelles informations du rôle.
   * @returns Le rôle mis à jour.
   * @throws NotFoundException si aucun rôle n'est trouvé avec l'ID fourni.
   * @throws ConflictException si un rôle avec le même nom existe déjà.
   */
  async update(id: string, roleDto: UpdateRoleDto): Promise<Role> {
    const existingRole = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });

    if (!existingRole) {
      throw new NotFoundException(
        'Impossible de modifier : aucun rôle trouvé avec cet identifiant.',
      );
    }

    // Only check for duplicate name and assign if roleName is provided
    if (roleDto.roleName) {
      const roleWithSameName = await this.roleRepository.findOne({
        where: { roleName: roleDto.roleName, id: Not(id) },
      });
      if (roleWithSameName) {
        throw new ConflictException(
          'Impossible de modifier : un rôle avec ce nom existe déjà.',
        );
      }
      existingRole.roleName = roleDto.roleName;
    }

    if (existingRole.permissions && existingRole.permissions.length > 0) {
      await this.permissionRepository.remove(existingRole.permissions);
      existingRole.permissions = [];
      await this.roleRepository.save(existingRole);
    }

    if (roleDto.permissions && roleDto.permissions.length > 0) {
      const newPermissions = roleDto.permissions.map((perm) =>
        this.permissionRepository.create({ ...perm, role: existingRole }),
      );
      existingRole.permissions = newPermissions;
    }

    return this.roleRepository.save(existingRole);
  }
}
