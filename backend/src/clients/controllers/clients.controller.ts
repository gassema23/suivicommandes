import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthorizationsGuard } from '../../auth/guards/authorizations.guard';
import { ClientsService } from '../services/clients.service';
import { Resource } from '../../roles/enums/resource.enum';
import { Permissions } from '../../roles/decorators/permission.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Action } from '../../roles/enums/action.enum';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';
import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';
import { instanceToPlain } from 'class-transformer';
import { UuidParamPipe } from '../../common/pipes/uuid-param.pipe';

@Controller('clients')
@ApiTags('Clients')
@UseGuards(AuthGuard('jwt'), AuthorizationsGuard)
@ApiBearerAuth()
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  /**
   * Controller pour gérer les clients.
   * Permet de créer, lire, mettre à jour et supprimer des clients.
   * @param clientsService - Service pour gérer les clients.
   */
  @Get()
  @Permissions([{ resource: Resource.CLIENTS, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Liste des clients' })
  @ApiResponse({ status: 200, description: 'Succès' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Recherche par nom',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.clientsService.findAll(
      paginationDto,
      paginationDto.search,
    );
    return {
      ...result,
      data: result.data.map((client) => instanceToPlain(client)),
    };
  }

  /**
   * Crée un nouveau client.
   * @param createClientDto - DTO pour la création d'un client.
   * @param currentUser - Utilisateur actuel effectuant la requête.
   * @returns Le client créé.
   */
  @Post()
  @Permissions([{ resource: Resource.CLIENTS, actions: [Action.CREATE] }])
  @ApiOperation({ summary: 'Créer un client' })
  @ApiResponse({ status: 201, description: 'Succès' })
  async create(
    @Body() createClientDto: CreateClientDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.clientsService.create(createClientDto, currentUser.id);
  }

  /**
   * Récupère la liste des clients pour le sélecteur.
   * @returns Liste des clients formatée pour le sélecteur.
   */
  @Get('clientsList')
  @Permissions([{ resource: Resource.CLIENTS, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Liste des clients (sélecteur)' })
  @ApiResponse({ status: 200, description: 'Succès' })
  async getClientsList() {
    const clients = await this.clientsService.getClientsList();
    return clients.map((client) => instanceToPlain(client));
  }

  /**
   * Récupère un client par son ID.
   * @param id - ID du client à récupérer.
   * @returns Le client correspondant à l'ID.
   */
  @Get(':id')
  @Permissions([{ resource: Resource.CLIENTS, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Afficher un client' })
  @ApiResponse({ status: 200, description: 'Succès' })
  @ApiResponse({ status: 404, description: 'Non trouvé' })
  async findOne(@Param('id', UuidParamPipe) id: string) {
    const client = await this.clientsService.findOne(id);
    return instanceToPlain(client);
  }

  /**
   * Met à jour un client existant.
   * @param id - ID du client à mettre à jour.
   * @param updateClientDto - DTO contenant les données de mise à jour.
   * @param currentUser - Utilisateur actuel effectuant la requête.
   * @returns Le client mis à jour.
   */
  @Patch(':id')
  @Permissions([{ resource: Resource.CLIENTS, actions: [Action.UPDATE] }])
  @ApiOperation({ summary: 'Mettre à jour un client' })
  @ApiResponse({ status: 200, description: 'Succès' })
  @ApiResponse({ status: 404, description: 'Non trouvé' })
  async update(
    @Param('id', UuidParamPipe) id: string,
    @Body() updateClientDto: UpdateClientDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.clientsService.update(id, updateClientDto, currentUser.id);
  }

  /**
   * Supprime un client.
   * @param id - ID du client à supprimer.
   * @param currentUser - Utilisateur actuel effectuant la requête.
   * @returns Confirmation de la suppression.
   */
  @Delete(':id')
  @Permissions([{ resource: Resource.CLIENTS, actions: [Action.DELETE] }])
  @ApiOperation({ summary: 'Supprimer un client' })
  @ApiResponse({ status: 200, description: 'Succès' })
  @ApiResponse({ status: 404, description: 'Non trouvé' })
  async remove(
    @Param('id', UuidParamPipe) id: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.clientsService.remove(id, currentUser.id);
  }
}
