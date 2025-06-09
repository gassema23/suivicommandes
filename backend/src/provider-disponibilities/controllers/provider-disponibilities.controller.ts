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
import { ProviderDisponibilitiesService } from '../services/provider-disponibilities.service';
import { Permissions } from '../../roles/decorators/permission.decorator';
import { Resource } from '../../roles/enums/resource.enum';
import { Action } from '../../roles/enums/action.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CreateProviderDisponibilityDto } from '../dto/create-provider-disponibility.dto';
import { User } from '../../users/entities/user.entity';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { UpdateProviderDisponibilityDto } from '../dto/update-provider-disponibility.dto';

@ApiTags('ProviderDisponibilities')
@Controller('provider-disponibilities')
@UseGuards(AuthGuard('jwt'), AuthorizationsGuard)
@ApiBearerAuth()
export class ProviderDisponibilitiesController {
  /**
   * Contrôleur pour gérer les disponibilités des fournisseurs.
   * Permet de créer, lire, mettre à jour et supprimer des disponibilités.
   *
   * @param providerDisponibilitiesService - Service pour gérer les disponibilités des fournisseurs.
   */
  constructor(
    private readonly providerDisponibilitiesService: ProviderDisponibilitiesService,
  ) {}

  /**
   * Récupère toutes les disponibilités des fournisseurs avec pagination et recherche.
   * @param paginationDto - DTO pour la pagination.
   * @returns Un objet contenant les disponibilités et les métadonnées de pagination.
   */
  @Get()
  @Permissions([
    { resource: Resource.PROVIDER_DISPONIBILITIES, actions: [Action.READ] },
  ])
  @ApiOperation({
    summary: 'Afficher la liste des disponibilités fournisseurs',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Recherche par nom/date',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.providerDisponibilitiesService.findAll(
      paginationDto,
      paginationDto.search,
    );
  }

  /**
   * Crée une nouvelle disponibilité fournisseur.
   * @param createProviderDisponibilityDto - DTO contenant les détails de la disponibilité à créer.
   * @param currentUser - Utilisateur actuel effectuant l'action.
   * @returns La disponibilité fournisseur créée.
   */
  @Post()
  @Permissions([
    { resource: Resource.PROVIDER_DISPONIBILITIES, actions: [Action.CREATE] },
  ])
  @ApiOperation({ summary: 'Créer une disponibilité fournisseur' })
  @ApiResponse({
    status: 201,
    description: 'Disponibilité fournisseur créé avec succès',
  })
  async create(
    @Body() createProviderDisponibilityDto: CreateProviderDisponibilityDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.providerDisponibilitiesService.create(
      createProviderDisponibilityDto,
      currentUser.id,
    );
  }

  /**
   * Récupère une disponibilité fournisseur par son ID.
   * @param id - ID de la disponibilité à récupérer.
   * @returns La disponibilité trouvée.
   */
  @Get(':id')
  @Permissions([
    { resource: Resource.PROVIDER_DISPONIBILITIES, actions: [Action.READ] },
  ])
  @ApiOperation({
    summary: 'Afficher une disponibilité fournisseur par son ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Disponibilité fournisseur récupérée avec succès',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.providerDisponibilitiesService.findOne(id);
  }

  /**
   * Met à jour une disponibilité fournisseur.
   * @param id - ID de la disponibilité à mettre à jour.
   * @param updateProviderDisponibilityDto - DTO contenant les détails mis à jour.
   * @param currentUser - Utilisateur actuel effectuant l'action.
   * @returns La disponibilité fournisseur mise à jour.
   */
  @Patch(':id')
  @Permissions([
    { resource: Resource.PROVIDER_DISPONIBILITIES, actions: [Action.UPDATE] },
  ])
  @ApiOperation({ summary: 'Mettre à jour la disponibilité fournisseur' })
  @ApiResponse({
    status: 200,
    description: 'Disponibilité fournisseur mise à jour',
  })
  @ApiResponse({
    status: 404,
    description: 'Disponibilité fournisseur non trouvée',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProviderDisponibilityDto: UpdateProviderDisponibilityDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.providerDisponibilitiesService.update(
      id,
      updateProviderDisponibilityDto,
      currentUser.id,
    );
  }

  /**
   * Supprime une disponibilité fournisseur.
   * @param id - ID de la disponibilité à supprimer.
   * @param currentUser - Utilisateur actuel effectuant l'action.
   * @returns Confirmation de la suppression.
   */
  @Delete()
  @Permissions([
    { resource: Resource.PROVIDER_DISPONIBILITIES, actions: [Action.DELETE] },
  ])
  @ApiOperation({ summary: 'Supprimer une disponibilité fournisseur' })
  @ApiResponse({
    status: 200,
    description: 'Disponibilité fournisseur supprimée avec succès',
  })
  async remove(@Body('id') id: string, @CurrentUser() currentUser: User) {
    return this.providerDisponibilitiesService.remove(id, currentUser.id);
  }
}
