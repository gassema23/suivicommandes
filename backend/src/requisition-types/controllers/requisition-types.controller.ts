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
import { RequisitionTypesService } from '../services/requisition-types.service';
import { Permissions } from '../../roles/decorators/permission.decorator';
import { Resource } from '../../roles/enums/resource.enum';
import { Action } from '../../roles/enums/action.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CreateRequisitionTypeDto } from '../dto/create-requisition-type.dto';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';
import { UpdateRequisitionTypeDto } from '../dto/update-requisition-type.dto';

@ApiTags('Requisition types')
@Controller('requisition-types')
@UseGuards(AuthGuard('jwt'), AuthorizationsGuard)
@ApiBearerAuth()
export class RequisitionTypesController {
  /**
   * Contrôleur pour gérer les types de réquisitions
   * @param requisitionTypesService Service pour gérer les types de réquisitions
   * @description Ce contrôleur gère les opérations CRUD pour les types de réquisitions.
   */
  constructor(
    private readonly requisitionTypesService: RequisitionTypesService,
  ) {}

  /**
   * Récupère la liste des types de réquisitions avec pagination et recherche
   * @param paginationDto DTO pour la pagination
   * @returns Liste paginée des types de réquisitions
   */
  @Get()
  @Permissions([
    { resource: Resource.REQUISITION_TYPES, actions: [Action.READ] },
  ])
  @ApiOperation({ summary: 'Afficher la liste des types de réquisitions' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Recherche par nom/date',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.requisitionTypesService.findAll(
      paginationDto,
      paginationDto.search,
    );
  }

  /**
   * Crée un nouveau type de réquisition
   * @param createRequisitionTypeDto DTO contenant les détails du type de réquisition à créer
   * @param currentUser Utilisateur actuel effectuant la création
   * @returns Le type de réquisition créé
   */
  @Post()
  @Permissions([
    { resource: Resource.REQUISITION_TYPES, actions: [Action.CREATE] },
  ])
  @ApiOperation({ summary: 'Créer un type de délai' })
  @ApiResponse({ status: 201, description: 'Type de délai créé avec succès' })
  async create(
    @Body() createRequisitionTypeDto: CreateRequisitionTypeDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.requisitionTypesService.create(
      createRequisitionTypeDto,
      currentUser.id,
    );
  }

  /**
   * Récupère un type de réquisition par son ID
   * @param id ID du type de réquisition à récupérer
   * @returns Le type de réquisition correspondant à l'ID
   */
  @Get(':id')
  @Permissions([
    { resource: Resource.REQUISITION_TYPES, actions: [Action.READ] },
  ])
  @ApiOperation({ summary: 'Afficher un type de réquisition par son ID' })
  @ApiResponse({
    status: 200,
    description: 'Type de réquisition récupéré avec succès',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.requisitionTypesService.findOne(id);
  }

  /**
   * Met à jour un type de réquisition
   * @param id ID du type de réquisition à mettre à jour
   * @param updateRequisitionTypeDto DTO contenant les informations mises à jour
   * @param currentUser Utilisateur actuel effectuant la mise à jour
   * @returns Le type de réquisition mis à jour
   */
  @Patch(':id')
  @Permissions([{ resource: Resource.REQUISITION_TYPES, actions: [Action.UPDATE] }])
  @ApiOperation({ summary: 'Mettre à jour le type de réquisition' })
  @ApiResponse({ status: 200, description: 'Type de réquisition mise à jour' })
  @ApiResponse({ status: 404, description: 'Type de réquisition non trouvée' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRequisitionTypeDto: UpdateRequisitionTypeDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.requisitionTypesService.update(
      id,
      updateRequisitionTypeDto,
      currentUser.id,
    );
  }

/**
   * Supprime un type de réquisition
   * @param id ID du type de réquisition à supprimer
   * @param currentUser Utilisateur actuel effectuant la suppression
   * @returns Confirmation de la suppression
   */
  @Delete()
  @Permissions([{ resource: Resource.REQUISITION_TYPES, actions: [Action.DELETE] }])
  @ApiOperation({ summary: 'Supprimer un type de réquisition' })
  @ApiResponse({
    status: 200,
    description: 'Type de réquisition supprimé avec succès',
  })
  async remove(@Body('id') id: string, @CurrentUser() currentUser: User) {
    return this.requisitionTypesService.remove(id, currentUser.id);
  }
}
