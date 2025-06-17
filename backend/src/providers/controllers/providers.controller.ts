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
import { ProvidersService } from '../services/providers.service';
import { Resource } from '../../roles/enums/resource.enum';
import { Action } from '../../roles/enums/action.enum';
import { Permissions } from '../../roles/decorators/permission.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CreateProviderDto } from '../dto/create-provider.dto';
import { User } from '../../users/entities/user.entity';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { UpdateProviderDto } from '../dto/update-provider.dto';
import { instanceToPlain } from 'class-transformer';
import { UuidParamPipe } from '@/common/pipes/uuid-param.pipe';

@ApiTags('Providers')
@Controller('providers')
@UseGuards(AuthGuard('jwt'), AuthorizationsGuard)
@ApiBearerAuth()
export class ProvidersController {
  /**
   * Controller pour gérer les fournisseurs.
   * Permet de créer, lire, mettre à jour et supprimer des fournisseurs.
   *
   * @param providersService - Service pour les opérations liées aux fournisseurs.
   */
  constructor(private readonly providersService: ProvidersService) {}

  /**
   * Récupère la liste des fournisseurs avec pagination et recherche.
   * @param paginationDto - DTO pour la pagination.
   * @returns Un objet contenant les fournisseurs et les métadonnées de pagination.
   */
  @Get()
  @Permissions([{ resource: Resource.PROVIDERS, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Afficher la liste des fournisseurs' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Recherche par nom/date',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.providersService.findAll(
      paginationDto,
      paginationDto.search,
    );
    return {
      ...result,
      data: result.data.map((provider) => instanceToPlain(provider)),
    };
  }

  /**
   * Crée un nouveau fournisseur.
   * @param createProviderDto - DTO pour la création d'un fournisseur.
   * @param currentUser - Utilisateur actuel effectuant la requête.
   * @returns Le fournisseur créé.
   */
  @Post()
  @Permissions([{ resource: Resource.PROVIDERS, actions: [Action.CREATE] }])
  @ApiOperation({ summary: 'Créer un fournisseur' })
  @ApiResponse({ status: 201, description: 'Fournisseur créé avec succès' })
  async create(
    @Body() createProviderDto: CreateProviderDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.providersService.create(createProviderDto, currentUser.id);
  }

  /**
   * Récupère la liste des fournisseurs.
   * @returns Un tableau de fournisseurs.
   */
  @Get('providersList')
  @Permissions([{ resource: Resource.PROVIDERS, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Afficher la liste des fournisseurs' })
  async sectorsList() {
    const providers = await this.providersService.providersList();
    return providers.map((provider) => instanceToPlain(provider));
  }

  /**
   * Récupère un fournisseur par son ID.
   * @param id - ID du fournisseur.
   * @returns Le fournisseur correspondant à l'ID.
   */
  @Get(':id')
  @Permissions([{ resource: Resource.PROVIDERS, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Afficher un fournisseur par son ID' })
  @ApiResponse({
    status: 200,
    description: 'Fournisseur récupéré avec succès',
  })
  async findOne(@Param('id', UuidParamPipe) id: string) {
    return this.providersService.findOne(id);
  }

  /**
   * Met à jour un fournisseur.
   * @param id - ID du fournisseur à mettre à jour.
   * @param updateProviderDto - DTO pour la mise à jour du fournisseur.
   * @param currentUser - Utilisateur actuel effectuant la requête.
   * @returns Le fournisseur mis à jour.
   */
  @Patch(':id')
  @Permissions([{ resource: Resource.PROVIDERS, actions: [Action.UPDATE] }])
  @ApiOperation({ summary: 'Mettre à jour le fournisseur' })
  @ApiResponse({ status: 200, description: 'Fournisseur mise à jour' })
  @ApiResponse({ status: 404, description: 'Fournisseur non trouvée' })
  async update(
    @Param('id', UuidParamPipe) id: string,
    @Body() updateProviderDto: UpdateProviderDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.providersService.update(id, updateProviderDto, currentUser.id);
  }

  /**
   * Supprime un fournisseur.
   * @param id - ID du fournisseur à supprimer.
   * @param currentUser - Utilisateur actuel effectuant la requête.
   * @returns Confirmation de la suppression du fournisseur.
   */
  @Delete(':id')
  @Permissions([{ resource: Resource.PROVIDERS, actions: [Action.DELETE] }])
  @ApiOperation({ summary: 'Supprimer un fournisseur' })
  @ApiResponse({ status: 200, description: 'Fournisseur supprimé avec succès' })
  async remove(
    @Param('id', UuidParamPipe) id: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.providersService.remove(id, currentUser.id);
  }
}
