import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from '../services/roles.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { Permissions } from '../../roles/decorators/permission.decorator';
import { Resource } from '../../roles/enums/resource.enum';
import { Action } from '../../roles/enums/action.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { instanceToPlain } from 'class-transformer';
import { AuthGuard } from '@nestjs/passport';
import { AuthorizationsGuard } from '../../auth/guards/authorizations.guard';
import { UpdateRoleDto } from '../dto/update-role.dto';

@Controller('roles')
@UseGuards(AuthGuard('jwt'), AuthorizationsGuard)
export class RolesController {
  /**
   * Contrôleur pour gérer les rôles.
   * Permet de créer, lire, mettre à jour et supprimer des rôles.
   *
   * @param rolesService - Service pour gérer les rôles.
   */
  constructor(private readonly rolesService: RolesService) {}

  /**
   * Crée un nouveau rôle.
   * @param role - DTO contenant les informations du rôle à créer.
   * @returns Le rôle créé.
   * @throws ConflictException si un rôle avec le même nom existe déjà.
   */
  @Post()
  @Permissions([{ resource: Resource.ROLES, actions: [Action.CREATE] }])
  async createRole(@Body() role: CreateRoleDto) {
    return this.rolesService.create(role);
  }

  /**
   * Supprime un rôle par son ID.
   * @param id - ID du rôle à supprimer.
   * @returns Le rôle supprimé.
   * @throws ConflictException si aucun rôle n'est trouvé avec l'ID fourni.
   */
  @Get()
  @Permissions([{ resource: Resource.ROLES, actions: [Action.READ] }])
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query('search') search?: string,
  ) {
    const result = await this.rolesService.findAll(paginationDto, search);
    return {
      ...result,
      data: result.data.map((role) => instanceToPlain(role)),
    };
  }

  /**
   * Récupère la liste des ressources disponibles pour les rôles.
   * @return Un tableau d'objets représentant les ressources.
   */
  @Get('resources')
  @Permissions([{ resource: Resource.ROLES, actions: [Action.READ] }])
  async getResources() {
    return Object.values(Resource).map((resource) => ({
      value: resource,
      label: resource.charAt(0).toUpperCase() + resource.slice(1),
    }));
  }

  /**
   * Récupère la liste des actions disponibles pour les rôles.
   * @return Un tableau d'objets représentant les actions.
   */
  @Get('rolesList')
  @Permissions([{ resource: Resource.ROLES, actions: [Action.READ] }])
  async getRolesList() {
    const roles = await this.rolesService.getRolesList();
    return roles.map((role) => instanceToPlain(role));
  }

  /**
   * Récupère un rôle par son ID.
   * @param id - ID du rôle à récupérer.
   * @returns Le rôle correspondant à l'ID.
   * @throws ConflictException si aucun rôle n'est trouvé avec l'ID fourni.
   */
  @Get(':id')
  @Permissions([{ resource: Resource.ROLES, actions: [Action.READ] }])
  async findOne(@Param('id') id: string) {
    const role = await this.rolesService.findById(id);
    return instanceToPlain(role);
  }

  /**
   * Met à jour un rôle par son ID.
   * @param id - ID du rôle à mettre à jour.
   * @param role - DTO contenant les informations du rôle à mettre à jour.
   * @returns Le rôle mis à jour.
   * @throws ConflictException si aucun rôle n'est trouvé avec l'ID fourni.
   */
  @Patch(':id')
  @Permissions([{ resource: Resource.ROLES, actions: [Action.UPDATE] }])
  async updateRole(@Param('id') id: string, @Body() role: UpdateRoleDto) {
    return this.rolesService.update(id, role);
  }
}
