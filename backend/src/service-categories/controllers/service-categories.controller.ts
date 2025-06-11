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
import { ServiceCategoriesService } from '../services/service-categories.service';
import { Resource } from '../../roles/enums/resource.enum';
import { Action } from '../../roles/enums/action.enum';
import { Permissions } from '../../roles/decorators/permission.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';
import { CreateServiceCategoryDto } from '../dto/create-service-category.dto';

@Controller('service-categories')
@ApiTags('Services Categories')
@UseGuards(AuthGuard('jwt'), AuthorizationsGuard)
@ApiBearerAuth()
export class ServiceCategoriesController {
  /**
   * Contrôleur pour gérer les catégories de service.
   * Permet de créer, lire, mettre à jour et supprimer des catégories de service.
   *
   * @param serviceCategoriesService - Service pour accéder aux données des catégories de service.
   */
  constructor(
    private readonly serviceCategoriesService: ServiceCategoriesService,
  ) {}

  /**
   * Récupère toutes les catégories de service avec pagination et recherche.
   * @param paginationDto - DTO pour la pagination.
   * @returns Un tableau de catégories de service paginées.
   */
  @Get()
  @Permissions([
    { resource: Resource.SERVICE_CATEGORIES, actions: [Action.READ] },
  ])
  @ApiOperation({ summary: 'Obtenir la liste des catégories de services' })
  @ApiResponse({ status: 200, description: 'Liste des catégorie de services' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Recherche par nom',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.serviceCategoriesService.findAll(
      paginationDto,
      paginationDto.search,
    );
  }

  /**
   * Crée une nouvelle catégorie de service.
   * @param createServiceCategoryDto - DTO pour la création d'une catégorie de service.
   * @param currentUser - Utilisateur actuel effectuant la requête.
   * @returns La catégorie de service créée.
   */
  @Post()
  @Permissions([
    { resource: Resource.SERVICE_CATEGORIES, actions: [Action.CREATE] },
  ])
  @ApiOperation({ summary: 'Créer une nouvelle catégorie de service' })
  @ApiResponse({
    status: 201,
    description: 'Catégorie de service créée avec succès',
  })
  async create(
    @Body() createServiceCategoryDto: CreateServiceCategoryDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.serviceCategoriesService.create(
      createServiceCategoryDto,
      currentUser.id,
    );
  }

  @Get(':id/request-type-service-categories')
  @Permissions([
    { resource: Resource.SERVICE_CATEGORIES, actions: [Action.READ] },
    { resource: Resource.REQUEST_TYPE_SERVICE_CATEGORIES, actions: [Action.READ] },
  ])
  @ApiOperation({
    summary: 'Obtenir les type de demande d’un service par son ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Type de demande récupérés avec succès',
  })
  async getRequestTypeServiceCategoryByServiceCategoryId(@Param('id', ParseUUIDPipe) id: string) {
    return this.serviceCategoriesService.getRequestTypeServiceCategory(id);
  }

  /**
   * Récupère une catégorie de service par son ID.
   * @param id - ID de la catégorie de service à récupérer.
   * @returns La catégorie de service trouvée.
   */
  @Get(':id')
  @Permissions([
    { resource: Resource.SERVICE_CATEGORIES, actions: [Action.READ] },
  ])
  @ApiOperation({ summary: 'Obtenir une catégorie de service par son ID' })
  @ApiResponse({
    status: 200,
    description: 'Catégorie de service trouvée',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.serviceCategoriesService.findOne(id);
  }

  /**
   * Met à jour une catégorie de service existante.
   * @param id - ID de la catégorie de service à mettre à jour.
   * @param updateServiceCategoryDto - DTO contenant les nouvelles informations.
   * @param currentUser - Utilisateur actuel effectuant la mise à jour.
   * @returns La catégorie de service mise à jour.
   */
  @Patch(':id')
  @Permissions([
    { resource: Resource.SERVICE_CATEGORIES, actions: [Action.UPDATE] },
  ])
  @ApiOperation({ summary: 'Mettre à jour une catégorie de service' })
  @ApiResponse({
    status: 200,
    description: 'Catégorie de service mise à jour avec succès',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateServiceCategoryDto: CreateServiceCategoryDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.serviceCategoriesService.update(
      id,
      updateServiceCategoryDto,
      currentUser.id,
    );
  }

  /**
   * Supprime une catégorie de service par son ID.
   * @param id - ID de la catégorie de service à supprimer.
   * @param currentUser - Utilisateur actuel effectuant la suppression.
   * @returns Confirmation de la suppression de la catégorie de service.
   */
  @Delete(':id')
  @Permissions([
    { resource: Resource.SERVICE_CATEGORIES, actions: [Action.DELETE] },
  ])
  @ApiOperation({ summary: 'Supprimer une catégorie service' })
  @ApiResponse({
    status: 200,
    description: 'la catégorie de service supprimé avec succès',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.serviceCategoriesService.remove(id, currentUser.id);
  }
}
