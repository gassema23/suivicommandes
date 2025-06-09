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

import { TeamsService } from '../services/teams.service';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';
import { CreateTeamDto } from '../dto/create-team.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { UpdateTeamDto } from '../dto/update-team.dto';
import { Permissions } from '../../roles/decorators/permission.decorator';
import { Resource } from '../../roles/enums/resource.enum';
import { Action } from '../../roles/enums/action.enum';
import { AuthorizationsGuard } from '../../auth/guards/authorizations.guard';
import { instanceToPlain } from 'class-transformer';

@ApiTags('Teams')
@Controller('teams')
@UseGuards(AuthGuard('jwt'), AuthorizationsGuard)
@ApiBearerAuth()
export class TeamsController {
  /**
   * Contrôleur pour gérer les équipes.
   * Permet de créer, lire, mettre à jour et supprimer des équipes.
   *
   * @param teamsService - Service pour les opérations liées aux équipes.
   */
  constructor(private readonly teamsService: TeamsService) {}

  /**
   * Crée une nouvelle équipe.
   * @param createTeamDto - DTO pour la création d'une équipe.
   * @param currentUser - Utilisateur actuel effectuant la requête.
   * @returns L'équipe créée.
   */
  @Post()
  @Permissions([{ resource: Resource.TEAMS, actions: [Action.CREATE] }])
  @ApiOperation({ summary: 'Créer une nouvelle équipe' })
  @ApiResponse({ status: 201, description: 'Équipe créée avec succès' })
  async create(
    @Body() createTeamDto: CreateTeamDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.teamsService.create(createTeamDto, currentUser.id);
  }

  /**
   * Récupère la liste des équipes.
   * @returns Un tableau d'équipes.
   */
  @Get('teamsList')
  @Permissions([{ resource: Resource.TEAMS, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Obtenir la liste des équipes' })
  @ApiResponse({ status: 200, description: 'Liste des équipes' })
  async getTeamsList() {
    const teams = await this.teamsService.getTeamsList();
    return teams;
  }

  /**
   * Récupère toutes les équipes avec pagination et recherche.
   * @param paginationDto - DTO pour la pagination.
   * @returns Un objet contenant les équipes et les métadonnées de pagination.
   */
  @Get()
  @Permissions([{ resource: Resource.TEAMS, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Obtenir la liste des équipes' })
  @ApiResponse({ status: 200, description: 'Liste des équipes' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Recherche par nom',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.teamsService.findAll(
      paginationDto,
      paginationDto.search,
    );
    return {
      ...result,
      data: result.data.map((team) => instanceToPlain(team)),
    };
  }

  /**
   * Récupère une équipe par son ID.
   * @param id - ID de l'équipe à récupérer.
   * @returns L'équipe trouvée.
   */
  @Get(':id')
  @Permissions([{ resource: Resource.TEAMS, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Obtenir une équipe par ID' })
  @ApiResponse({ status: 200, description: 'Équipe trouvée' })
  @ApiResponse({ status: 404, description: 'Équipe non trouvée' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.teamsService.findOne(id);
  }

  /**
   * Met à jour une équipe par son ID.
   * @param id - ID de l'équipe à mettre à jour.
   * @param updateTeamDto - DTO pour la mise à jour de l'équipe.
   * @param currentUser - Utilisateur actuel effectuant la mise à jour.
   * @returns L'équipe mise à jour.
   */
  @Patch(':id')
  @Permissions([{ resource: Resource.TEAMS, actions: [Action.UPDATE] }])
  @ApiOperation({ summary: 'Mettre à jour une équipe' })
  @ApiResponse({ status: 200, description: 'Équipe mise à jour' })
  @ApiResponse({ status: 404, description: 'Équipe non trouvée' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTeamDto: UpdateTeamDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.teamsService.update(id, updateTeamDto, currentUser.id);
  }

  /**
   * Supprime une équipe par son ID.
   * @param id - ID de l'équipe à supprimer.
   * @param currentUser - Utilisateur actuel effectuant la suppression.
   * @returns Un message de confirmation de suppression.
   */
  @Delete()
  @Permissions([{ resource: Resource.TEAMS, actions: [Action.DELETE] }])
  @ApiOperation({ summary: 'Supprimer une équipe' })
  @ApiResponse({ status: 200, description: 'Équipe supprimée' })
  @ApiResponse({ status: 404, description: 'Équipe non trouvée' })
  async remove(@Body('id') id: string, @CurrentUser() currentUser: User) {
    await this.teamsService.remove(id, currentUser.id);
    return { message: 'Équipe supprimée avec succès' };
  }

  /**
   * Récupère les équipes d'un utilisateur.
   * @param userId - ID de l'utilisateur.
   * @returns Un tableau d'équipes de l'utilisateur.
   */
  @Post(':teamId/members/:userId')
  @ApiOperation({ summary: "Ajouter un utilisateur à l'équipe" })
  @ApiResponse({ status: 200, description: "Utilisateur ajouté à l'équipe" })
  async addMember(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    await this.teamsService.addUserToTeam(teamId, userId);
    return { message: "Utilisateur ajouté à l'équipe avec succès" };
  }

  /**
   * Retire un utilisateur d'une équipe.
   * @param teamId - ID de l'équipe.
   * @param userId - ID de l'utilisateur à retirer.
   * @returns Un message de confirmation de retrait.
   */
  @Delete(':teamId/members/:userId')
  @ApiOperation({ summary: "Retirer un utilisateur de l'équipe" })
  @ApiResponse({ status: 200, description: "Utilisateur retiré de l'équipe" })
  async removeMember(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    await this.teamsService.removeUserFromTeam(teamId, userId);
    return { message: "Utilisateur retiré de l'équipe avec succès" };
  }

  /**
   * Récupère les membres d'une équipe par son ID.
   * @param id - ID de l'équipe.
   * @returns Un tableau de membres de l'équipe.
   */
  @Get(':id/members')
  @ApiOperation({ summary: "Obtenir les membres d'une équipe" })
  @ApiResponse({ status: 200, description: "Membres de l'équipe" })
  async getMembers(@Param('id', ParseUUIDPipe) id: string) {
    return this.teamsService.getTeamMembers(id);
  }
}
