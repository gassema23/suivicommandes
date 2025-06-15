import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
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
import { SubdivisionClientsService } from '../services/subdivision-clients.service';
import { Resource } from '../../roles/enums/resource.enum';
import { Action } from '../../roles/enums/action.enum';
import { Permissions } from '../../roles/decorators/permission.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { instanceToPlain } from 'class-transformer';
import { User } from '../../users/entities/user.entity';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { CreateSubdivisionClientDto } from '../dto/create-subdivision-client.dto';
import { UpdateSubdivisionClientDto } from '../dto/update-subdivision-client.dto';

@Controller('subdivision-clients')
@ApiTags('Subdivision clients')
@UseGuards(AuthGuard('jwt'), AuthorizationsGuard)
@ApiBearerAuth()
export class SubdivisionClientsController {
  /**
   * Contrôleur pour gérer les subdivisions clients.
   * Permet de créer, lire, mettre à jour et supprimer des subdivisions clients.
   *
   * @param subdivisionClientsService - Service pour les opérations liées aux subdivisions clients.
   */
  constructor(
    private readonly subdivisionClientsService: SubdivisionClientsService,
  ) {}

  /**
   * Récupère la liste des subdivisions clients avec pagination et recherche.
   * @param paginationDto - DTO pour la pagination.
   * @returns Un objet contenant les subdivisions clients et les métadonnées de pagination.
   */
  @Get()
  @Permissions([
    { resource: Resource.SUBDIVISION_CLIENTS, actions: [Action.READ] },
  ])
  @ApiOperation({ summary: 'Obtenir la liste des subdivisions clients' })
  @ApiResponse({ status: 200, description: 'Liste des subdivisions clients' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Recherche par nom',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.subdivisionClientsService.findAll(
      paginationDto,
      paginationDto.search,
    );
    return {
      ...result,
      data: result.data.map((subdivisionClient) =>
        instanceToPlain(subdivisionClient),
      ),
    };
  }

  /**
   * Crée une nouvelle subdivision client.
   * @param createSubdivisionClientDto - DTO pour la création d'une subdivision client.
   * @param currentUser - Utilisateur actuel effectuant la création.
   * @returns La subdivision client créée.
   */
  @Post()
  @Permissions([
    { resource: Resource.SUBDIVISION_CLIENTS, actions: [Action.CREATE] },
  ])
  @ApiOperation({ summary: 'Créer une Subdivision client' })
  @ApiResponse({
    status: 201,
    description: 'Subdivision client créé avec succès',
  })
  async create(
    @Body() createSubdivisionClientDto: CreateSubdivisionClientDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.subdivisionClientsService.create(
      createSubdivisionClientDto,
      currentUser.id,
    );
  }

  /**
   * Récupère une subdivision client par son ID.
   * @param id - ID de la subdivision client à récupérer.
   * @returns La subdivision client trouvée.
   */
  @Get(':id')
  @Permissions([
    { resource: Resource.SUBDIVISION_CLIENTS, actions: [Action.READ] },
  ])
  @ApiOperation({ summary: 'Afficher une Subdivision client par son ID' })
  @ApiResponse({
    status: 200,
    description: 'Subdivision client récupéré avec succès',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const subdivisionClient = await this.subdivisionClientsService.findOne(id);
    return instanceToPlain(subdivisionClient);
  }

  /**
   * Met à jour une subdivision client existante.
   * @param id - ID de la subdivision client à mettre à jour.
   * @param updateSubdivisionClientDto - DTO contenant les données de mise à jour.
   * @param currentUser - Utilisateur actuel effectuant la mise à jour.
   * @returns La subdivision client mise à jour.
   */
  @Patch(':id')
  @Permissions([{ resource: Resource.SUBDIVISION_CLIENTS, actions: [Action.UPDATE] }])
  @ApiOperation({ summary: 'Mettre à jour la subdivision client' })
  @ApiResponse({
    status: 200,
    description: 'Subdivision client mis à jour avec succès',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSubdivisionClientDto: UpdateSubdivisionClientDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.subdivisionClientsService.update(
      id,
      updateSubdivisionClientDto,
      currentUser.id,
    );
  }

  /**
   * Supprime une subdivision client par son ID.
   * @param id - ID de la subdivision client à supprimer.
   * @param currentUser - Utilisateur actuel effectuant la suppression.
   * @returns Confirmation de la suppression.
   */
  @Delete()
  @Permissions([{ resource: Resource.SUBDIVISION_CLIENTS, actions: [Action.DELETE] }])
  @ApiOperation({ summary: 'Supprimer un jour férié' })
  @ApiResponse({ status: 200, description: 'Jour férié supprimé avec succès' })
  async remove(@Body('id') id: string, @CurrentUser() currentUser: User) {
    return this.subdivisionClientsService.remove(id, currentUser.id);
  }
}
