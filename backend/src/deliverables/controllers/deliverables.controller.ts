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
import { DeliverablesService } from '../services/deliverables.service';
import { Permissions } from '../../roles/decorators/permission.decorator';
import { Resource } from '../../roles/enums/resource.enum';
import { Action } from '../../roles/enums/action.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CreateDeliverableDto } from '../dto/create-deliverable.dto';
import { User } from '../../users/entities/user.entity';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { UpdateDeliverableDto } from '../dto/update-deliverable.dto';

@ApiTags('Deliverables')
@Controller('deliverables')
@UseGuards(AuthGuard('jwt'), AuthorizationsGuard)
@ApiBearerAuth()
export class DeliverablesController {
  /**
   * Contrôleur pour gérer les livrables
   * @param deliverablesService Service pour gérer les livrables
   * @description Ce contrôleur gère les opérations CRUD pour les livrables.
   */
  constructor(private readonly deliverablesService: DeliverablesService) {}

  /**
   * Récupérer la liste des livrables
   * @param paginationDto DTO de pagination et de recherche
   * @returns Liste paginée des livrables
   */
  @Get()
  @Permissions([{ resource: Resource.DELIVERABLES, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Afficher la liste des livrables' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Recherche par nom/date',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.deliverablesService.findAll(
      paginationDto,
      paginationDto.search,
    );
  }

  /**
   * Créer un nouveau livrable
   * @param createDeliverableDto DTO pour créer un livrable
   * @param currentUser Utilisateur actuel effectuant la requête
   * @returns Le livrable créé
   */
  @Post()
  @Permissions([{ resource: Resource.DELIVERABLES, actions: [Action.CREATE] }])
  @ApiOperation({ summary: 'Créer un livrable' })
  @ApiResponse({ status: 201, description: 'Livrable créé avec succès' })
  async create(
    @Body() createDeliverableDto: CreateDeliverableDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.deliverablesService.create(
      createDeliverableDto,
      currentUser.id,
    );
  }

  /**
   * Récupérer un livrable par son ID
   * @param id ID du livrable
   * @returns Le livrable correspondant à l'ID
   */
  @Get(':id')
  @Permissions([{ resource: Resource.DELIVERABLES, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Afficher un livrable par son ID' })
  @ApiResponse({
    status: 200,
    description: 'Livrable récupéré avec succès',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.deliverablesService.findOne(id);
  }

  /**
   * Mettre à jour un livrable
   * @param id ID du livrable à mettre à jour
   * @param updateDeliverableDto DTO de mise à jour du livrable
   * @param currentUser Utilisateur actuel effectuant la requête
   * @returns Le livrable mis à jour
   */
  @Patch(':id')
  @Permissions([{ resource: Resource.DELIVERABLES, actions: [Action.UPDATE] }])
  @ApiOperation({ summary: 'Mettre à jour le livrable' })
  @ApiResponse({ status: 200, description: 'Livrable mise à jour' })
  @ApiResponse({ status: 404, description: 'Livrable non trouvée' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDeliverableDto: UpdateDeliverableDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.deliverablesService.update(
      id,
      updateDeliverableDto,
      currentUser.id,
    );
  }

  /**
   * Supprimer un livrable
   * @param id ID du livrable à supprimer
   * @param currentUser Utilisateur actuel effectuant la requête
   * @returns Confirmation de la suppression du livrable
   */
  @Delete(':id')
  @Permissions([{ resource: Resource.DELIVERABLES, actions: [Action.DELETE] }])
  @ApiOperation({ summary: 'Supprimer un livrable' })
  @ApiResponse({ status: 200, description: 'Livrable supprimé avec succès' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.deliverablesService.remove(id, currentUser.id);
  }
}
