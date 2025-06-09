import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../entities/user.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { instanceToPlain } from 'class-transformer';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class UsersController {
  /**
   * Contrôleur pour gérer les utilisateurs.
   * Permet de créer, lire, mettre à jour et supprimer des utilisateurs.
   *
   * @param usersService - Service pour les opérations liées aux utilisateurs.
   */
  constructor(private readonly usersService: UsersService) {}

  /**
   * Crée un nouvel utilisateur.
   * @param createUserDto - DTO pour la création d'un utilisateur.
   * @param currentUser - Utilisateur actuel effectuant la requête.
   * @returns L'utilisateur créé.
   */
  @Post()
  @ApiOperation({ summary: 'Créer un nouvel utilisateur' })
  @ApiResponse({ status: 201, description: 'Utilisateur créé avec succès' })
  @ApiResponse({ status: 409, description: 'Email déjà utilisé' })
  async create(
    @Body() createUserDto: CreateUserDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.usersService.create(createUserDto, currentUser.id);
  }

  /**
   * Récupère la liste des utilisateurs avec pagination et recherche.
   * @param paginationDto - DTO pour la pagination.
   * @param search - Terme de recherche optionnel.
   * @returns Un objet contenant les utilisateurs et les métadonnées de pagination.
   */
  @Get()
  @ApiOperation({ summary: 'Obtenir la liste des utilisateurs' })
  @ApiResponse({ status: 200, description: 'Liste des utilisateurs' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Recherche par nom ou email',
  })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query('search') search?: string,
  ) {
    const result = await this.usersService.findAll(paginationDto, search);
    return {
      ...result,
      data: result.data.map((user) => instanceToPlain(user)),
    };
  }

  /**
   * Récupère la liste des utilisateurs pour les sélecteurs.
   * @param role - Filtre optionnel par rôle.
   * @returns Un tableau d'utilisateurs.
   */
  @Get('usersList')
  @ApiOperation({
    summary: 'Obtenir la liste des utilisateurs pour les sélecteurs',
  })
  @ApiResponse({ status: 200, description: 'Liste des utilisateurs' })
  async getUsersList(@Query('role') role?: string | string[]) {
    const users = await this.usersService.getUsersList(role);
    return users.map((user) => instanceToPlain(user));
  }

  /**
   * Récupère les statistiques des utilisateurs.
   * @returns Un objet contenant les statistiques des utilisateurs.
   */
  @Get('stats')
  @ApiOperation({ summary: 'Obtenir les statistiques des utilisateurs' })
  @ApiResponse({ status: 200, description: 'Statistiques des utilisateurs' })
  async getStats() {
    return this.usersService.getUserStats();
  }

  /**
   * Recherche des utilisateurs par un terme donné.
   * @param search - Terme de recherche.
   * @param limit - Nombre maximum de résultats à retourner.
   * @returns Un tableau d'utilisateurs correspondant à la recherche.
   */
  @Get('search')
  @ApiOperation({ summary: 'Rechercher des utilisateurs' })
  @ApiResponse({ status: 200, description: 'Résultats de recherche' })
  @ApiQuery({ name: 'q', description: 'Terme de recherche' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Nombre de résultats max',
  })
  async search(@Query('q') search: string, @Query('limit') limit?: number) {
    return this.usersService.searchUsers(search, limit);
  }

  /**
   * Récupère un utilisateur par son ID.
   * @param id - ID de l'utilisateur à récupérer.
   * @returns L'utilisateur trouvé.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un utilisateur par ID' })
  @ApiResponse({ status: 200, description: 'Utilisateur trouvé' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * Met à jour un utilisateur par son ID.
   * @param id - ID de l'utilisateur à mettre à jour.
   * @param updateUserDto - DTO pour la mise à jour de l'utilisateur.
   * @param currentUser - Utilisateur actuel effectuant la mise à jour.
   * @returns L'utilisateur mis à jour.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un utilisateur' })
  @ApiResponse({ status: 200, description: 'Utilisateur mis à jour' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.usersService.update(id, updateUserDto, currentUser.id);
  }

  /**
   * Supprime un utilisateur par son ID.
   * @param id - ID de l'utilisateur à supprimer.
   * @param currentUser - Utilisateur actuel effectuant la suppression.
   * @returns Un message de confirmation de suppression.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un utilisateur' })
  @ApiResponse({ status: 200, description: 'Utilisateur supprimé' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: User,
  ) {
    await this.usersService.remove(id, currentUser.id);
    return { message: 'Utilisateur supprimé avec succès' };
  }
}
