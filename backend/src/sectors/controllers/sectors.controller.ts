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
import { SectorsService } from '../services/sectors.service';
import { Permissions } from '../../roles/decorators/permission.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Resource } from '../../roles/enums/resource.enum';
import { Action } from '../../roles/enums/action.enum';
import { CreateSectorDto } from '../dto/create-sector.dto';
import { User } from '../../users/entities/user.entity';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { UpdateSectorDto } from '../dto/update-sector.dto';

@Controller('sectors')
@ApiTags('Sectors')
@UseGuards(AuthGuard('jwt'), AuthorizationsGuard)
@ApiBearerAuth()
export class SectorsController {
  /**
   * Contrôleur pour gérer les secteurs.
   * Permet de créer, lire, mettre à jour et supprimer des secteurs.
   *
   * @param sectorsService - Service pour gérer les secteurs.
   */
  constructor(private readonly sectorsService: SectorsService) {}

  /**
   * Récupère tous les secteurs avec pagination et recherche.
   * @param paginationDto - DTO pour la pagination.
   * @returns Un objet contenant les secteurs et les métadonnées de pagination.
   */
  @Get()
  @Permissions([{ resource: Resource.SECTORS, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Obtenir la liste des secteurs' })
  @ApiResponse({ status: 200, description: 'Liste des secteurs' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Recherche par nom',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.sectorsService.findAll(paginationDto, paginationDto.search);
  }

  /**
   * Récupère la liste des secteurs pour le sélecteur.
   * @returns Liste des secteurs avec uniquement les champs id et sectorName.
   */
  @Get('sectorsList')
  @Permissions([{ resource: Resource.SECTORS, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Obtenir la liste des secteurs pour le sélecteur' })
  @ApiResponse({
    status: 200,
    description: 'Liste des secteurs pour le sélecteur',
  })
  async getSectorsList() {
    return this.sectorsService.getSectorsList();
  }

  /**
   * Récupère les services associés à un secteur par son ID.
   * @param id - ID du secteur.
   * @returns Liste des services associés au secteur.
   */
  @Get(':id/services')
  @Permissions([
    { resource: Resource.SECTORS, actions: [Action.READ] },
    { resource: Resource.SERVICES, actions: [Action.READ] },
  ])
  @ApiOperation({ summary: 'Obtenir les services d’un secteur par son ID' })
  @ApiResponse({
    status: 200,
    description: 'Services du secteur récupérés avec succès',
  })
  async getServicesBySectorId(@Param('id', ParseUUIDPipe) id: string) {
    return this.sectorsService.getServicesBySectorId(id);
  }

  /**
   * Crée un nouveau secteur.
   * @param createSectorDto - DTO contenant les informations du secteur à créer.
   * @param currentUser - Utilisateur actuel effectuant la création.
   * @returns Le secteur créé.
   */
  @Post()
  @Permissions([{ resource: Resource.SECTORS, actions: [Action.CREATE] }])
  @ApiOperation({ summary: 'Créer un secteur' })
  @ApiResponse({ status: 201, description: 'Secteur créé avec succès' })
  async create(
    @Body() createSectorDto: CreateSectorDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.sectorsService.create(createSectorDto, currentUser.id);
  }

  /**
   * Récupère un secteur par son ID.
   * @param id - ID du secteur à récupérer.
   * @returns Le secteur correspondant à l'ID.
   */
  @Get(':id')
  @Permissions([{ resource: Resource.SECTORS, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Afficher un secteur par son ID' })
  @ApiResponse({
    status: 200,
    description: 'Jour férié récupéré avec succès',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.sectorsService.findOne(id);
  }

  /**
   * Met à jour un secteur.
   * @param id - ID du secteur à mettre à jour.
   * @param updateSectorDto - DTO contenant les informations à mettre à jour.
   * @param currentUser - Utilisateur actuel effectuant la mise à jour.
   * @returns Le secteur mis à jour.
   */
  @Patch(':id')
  @Permissions([{ resource: Resource.SECTORS, actions: [Action.UPDATE] }])
  @ApiOperation({ summary: 'Mettre à jour le secteur' })
  @ApiResponse({ status: 200, description: 'Secteur mise à jour' })
  @ApiResponse({ status: 404, description: 'Secteur non trouvée' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSectorDto: UpdateSectorDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.sectorsService.update(id, updateSectorDto, currentUser.id);
  }

/**
   * Supprime un secteur.
   * @param id - ID du secteur à supprimer.
   * @param currentUser - Utilisateur actuel effectuant la suppression.
   * @returns Confirmation de la suppression du secteur.
   */
  @Delete()
  @Permissions([{ resource: Resource.SECTORS, actions: [Action.DELETE] }])
  @ApiOperation({ summary: 'Supprimer un secteur' })
  @ApiResponse({ status: 200, description: 'le secteur supprimé avec succès' })
  async remove(@Body('id') id: string, @CurrentUser() currentUser: User) {
    return this.sectorsService.remove(id, currentUser.id);
  }
}
