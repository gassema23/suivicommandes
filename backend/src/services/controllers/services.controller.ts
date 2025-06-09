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
import { ServicesService } from '../services/services.service';
import { Permissions } from '../../roles/decorators/permission.decorator';
import { Resource } from '../../roles/enums/resource.enum';
import { Action } from '../../roles/enums/action.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { User } from '../../users/entities/user.entity';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { CreateServiceDto } from '../dto/create-service.dto';
import { UpdateServiceDto } from '../dto/update-service.dto';

@Controller('services')
@ApiTags('Services')
@UseGuards(AuthGuard('jwt'), AuthorizationsGuard)
@ApiBearerAuth()
export class ServicesController {
  /**
   * Contrôleur pour gérer les services.
   * Permet de créer, lire, mettre à jour et supprimer des services.
   *
   * @param servicesService - Service pour les opérations liées aux services.
   */
  constructor(private readonly servicesService: ServicesService) {}

  /**
   * Récupère la liste des services avec pagination et recherche.
   * @param paginationDto - DTO pour la pagination.
   * @returns Un objet contenant les services et les métadonnées de pagination.
   */
  @Get()
  @Permissions([{ resource: Resource.SERVICES, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Obtenir la liste des services' })
  @ApiResponse({ status: 200, description: 'Liste des services' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Recherche par nom',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.servicesService.findAll(paginationDto, paginationDto.search);
  }

  /**
   * Crée un nouveau service.
   * @param createServiceDto - DTO pour la création d'un service.
   * @param currentUser - Utilisateur actuel effectuant la requête.
   * @returns Le service créé.
   */
  @Post()
  @Permissions([{ resource: Resource.SERVICES, actions: [Action.CREATE] }])
  @ApiOperation({ summary: 'Créer un nouveau service' })
  @ApiResponse({ status: 201, description: 'Service créé avec succès' })
  async create(
    @Body() createServiceDto: CreateServiceDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.servicesService.create(createServiceDto, currentUser.id);
  }

  /**
   * Met à jour un service existant.
   * @param id - ID du service à mettre à jour.
   * @param updateServiceDto - DTO pour la mise à jour d'un service.
   * @param currentUser - Utilisateur actuel effectuant la requête.
   * @returns Le service mis à jour.
   */
  @Patch(':id')
  @Permissions([{ resource: Resource.SERVICES, actions: [Action.UPDATE] }])
  @ApiOperation({ summary: 'Mettre à jour un service' })
  @ApiResponse({ status: 200, description: 'Service mis à jour avec succès' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.servicesService.update(id, updateServiceDto, currentUser.id);
  }

  /**
   * Récupère la liste des services pour un select.
   * @returns Un tableau de services formatés pour un select.
   */
  @Get('servicesList')
  @Permissions([{ resource: Resource.SERVICES, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Obtenir la liste des services pour un select' })
  @ApiResponse({
    status: 200,
    description: 'Liste des services pour un select',
  })
  async getServicesList() {
    return this.servicesService.getServicesList();
  }

  /**
   * Récupère les catégories de services d'un service par son ID.
   * @param id - ID du service.
   * @returns Les catégories de services associées au service.
   */
  @Get(':id/service-categories')
  @Permissions([
    { resource: Resource.SECTORS, actions: [Action.READ] },
    { resource: Resource.SERVICES, actions: [Action.READ] },
  ])
  @ApiOperation({
    summary: 'Obtenir les catégories de services d’un service par son ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Catégorie de service récupérés avec succès',
  })
  async getServicesBySectorId(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicesService.getServiceCategoriesByServiceId(id);
  }

  /**
   * Récupère un service par son ID.
   * @param id - ID du service à récupérer.
   * @returns Le service correspondant à l'ID fourni.
   */
  @Get(':id')
  @Permissions([{ resource: Resource.SERVICES, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Obtenir un service par son ID' })
  @ApiResponse({ status: 200, description: 'Service trouvé' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicesService.findOne(id);
  }

  /**
   * Supprime un service par son ID.
   * @param id - ID du service à supprimer.
   * @param currentUser - Utilisateur actuel effectuant la requête.
   * @returns Confirmation de la suppression du service.
   */
  @Delete(':id')
  @Permissions([{ resource: Resource.SERVICES, actions: [Action.DELETE] }])
  @ApiOperation({ summary: 'Supprimer un service' })
  @ApiResponse({ status: 200, description: 'le service supprimé avec succès' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.servicesService.remove(id, currentUser.id);
  }
}
