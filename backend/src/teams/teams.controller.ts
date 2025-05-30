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

import { TeamsService } from './teams.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Permissions } from 'src/roles/decorators/permission.decorator';
import { Resource } from 'src/roles/enums/resource.enum';
import { Action } from 'src/roles/enums/action.enum';
import { AuthorizationsGuard } from 'src/auth/guards/authorizations.guard';

@ApiTags('Teams')
@Controller('teams')
@UseGuards(AuthGuard('jwt'), AuthorizationsGuard)
@ApiBearerAuth()
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

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
    console.log('Pagination DTO:', paginationDto);
    return this.teamsService.findAll(paginationDto, paginationDto.search);
  }

  @Get(':id')
  @Permissions([{ resource: Resource.TEAMS, actions: [Action.UPDATE] }])
  @ApiOperation({ summary: 'Obtenir une équipe par ID' })
  @ApiResponse({ status: 200, description: 'Équipe trouvée' })
  @ApiResponse({ status: 404, description: 'Équipe non trouvée' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    console.log('Fetching team with ID:', id);
    return this.teamsService.findOne(id);
  }

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

  @Delete()
  @Permissions([{ resource: Resource.TEAMS, actions: [Action.DELETE] }])
  @ApiOperation({ summary: 'Supprimer une équipe' })
  @ApiResponse({ status: 200, description: 'Équipe supprimée' })
  @ApiResponse({ status: 404, description: 'Équipe non trouvée' })
  async remove(
    @Body('id') id: string,
    @CurrentUser() currentUser: User,
  ) {
    await this.teamsService.remove(id, currentUser.id);
    return { message: 'Équipe supprimée avec succès' };
  }

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

  @Get(':id/members')
  @ApiOperation({ summary: "Obtenir les membres d'une équipe" })
  @ApiResponse({ status: 200, description: "Membres de l'équipe" })
  async getMembers(@Param('id', ParseUUIDPipe) id: string) {
    return this.teamsService.getTeamMembers(id);
  }
}
