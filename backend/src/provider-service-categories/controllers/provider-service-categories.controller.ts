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
import { ProviderServiceCategoriesService } from '../services/provider-service-categories.service';
import { Resource } from '../../roles/enums/resource.enum';
import { Permissions } from '../../roles/decorators/permission.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Action } from '../../roles/enums/action.enum';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';
import { CreateProviderServiceCategoryDto } from '../dto/create-provider-service-category.dto';
import { instanceToPlain } from 'class-transformer';

@Controller('provider-service-categories')
@ApiTags('Catégories de services fournisseurs')
@UseGuards(AuthGuard('jwt'), AuthorizationsGuard)
@ApiBearerAuth()
export class ProviderServiceCategoriesController {
  /**
   * Contrôleur pour gérer les catégories de services fournisseurs.
   * Permet de créer, lire, mettre à jour et supprimer des catégories de services.
   *
   * @param providerServiceCategoriesService - Service pour gérer les catégories de services fournisseurs.
   */
  constructor(
    private readonly providerServiceCategoriesService: ProviderServiceCategoriesService,
  ) {}

  /**
   * Récupère toutes les catégories de services fournisseurs avec pagination et recherche.
   * @param paginationDto - DTO pour la pagination.
   * @returns Un objet contenant les catégories de services et les métadonnées de pagination.
   */
  @Get()
  @Permissions([
    { resource: Resource.PROVIDER_SERVICE_CATEGORIES, actions: [Action.READ] },
  ])
  @ApiOperation({
    summary: 'Obtenir la liste des catégories de services fournisseurs',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des catégories de services fournisseurs',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Recherche par nom',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.providerServiceCategoriesService.findAll(
      paginationDto,
      paginationDto.search,
    );
    return {
      ...result,
      data: result.data.map((item) => instanceToPlain(item)),
    };
  }

  /**
   * Crée une nouvelle catégorie de service fournisseur.
   * @param createProviderServiceCategoryDto - DTO pour la création d'une catégorie de service fournisseur.
   * @param currentUser - Utilisateur actuel effectuant la requête.
   * @returns La catégorie de service créée.
   */
  @Post()
  @Permissions([
    {
      resource: Resource.PROVIDER_SERVICE_CATEGORIES,
      actions: [Action.CREATE],
    },
  ])
  @ApiOperation({
    summary: 'Créer une nouvelle catégories de services fournisseurs',
  })
  @ApiResponse({
    status: 201,
    description: 'Catégorie de service créée avec succès',
  })
  async create(
    @Body() createProviderServiceCategoryDto: CreateProviderServiceCategoryDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.providerServiceCategoriesService.create(
      createProviderServiceCategoryDto,
      currentUser.id,
    );
  }

  /**
   * Récupère une catégorie de service fournisseur par son ID.
   * @param id - ID de la catégorie de service à récupérer.
   * @returns La catégorie de service trouvée.
   */
  @Get(':id')
  @Permissions([
    { resource: Resource.PROVIDER_SERVICE_CATEGORIES, actions: [Action.READ] },
  ])
  @ApiOperation({
    summary: 'Obtenir une catégories de services fournisseurs par son ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Catégories de services fournisseurs trouvée',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.providerServiceCategoriesService.findOne(id);
  }

  /**
   * Met à jour une catégorie de service fournisseur.
   * @param id - ID de la catégorie de service à mettre à jour.
   * @param updateProviderServiceCategoryDto - DTO contenant les données mises à jour.
   * @param currentUser - Utilisateur actuel effectuant la requête.
   * @returns La catégorie de service mise à jour.
   */
  @Patch(':id')
  @Permissions([
    {
      resource: Resource.PROVIDER_SERVICE_CATEGORIES,
      actions: [Action.UPDATE],
    },
  ])
  @ApiOperation({
    summary: 'Mettre à jour une catégories de services fournisseurs',
  })
  @ApiResponse({
    status: 200,
    description: 'Catégorie de service mise à jour avec succès',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProviderServiceCategoryDto: CreateProviderServiceCategoryDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.providerServiceCategoriesService.update(
      id,
      updateProviderServiceCategoryDto,
      currentUser.id,
    );
  }

  /**
   * Supprime une catégorie de service fournisseur.
   * @param id - ID de la catégorie de service à supprimer.
   * @param currentUser - Utilisateur actuel effectuant la requête.
   * @returns Confirmation de la suppression.
   */
  @Delete()
  @Permissions([
    {
      resource: Resource.PROVIDER_SERVICE_CATEGORIES,
      actions: [Action.DELETE],
    },
  ])
  @ApiOperation({
    summary: 'Supprimer une catégories de services fournisseurs',
  })
  @ApiResponse({
    status: 200,
    description: 'la catégories de services fournisseurs supprimé avec succès',
  })
  async remove(@Body('id') id: string, @CurrentUser() currentUser: User) {
    return this.providerServiceCategoriesService.remove(id, currentUser.id);
  }
}
