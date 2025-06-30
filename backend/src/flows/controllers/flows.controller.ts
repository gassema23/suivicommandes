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
import { FlowsService } from '../services/flows.service';
import { Permissions } from '../../roles/decorators/permission.decorator';
import { Resource } from '../../roles/enums/resource.enum';
import { Action } from '../../roles/enums/action.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CreateFlowDto } from '../dto/create-flow.dto';
import { User } from '../../users/entities/user.entity';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { UpdateFlowDto } from '../dto/update-flow.dto';
import { UuidParamPipe } from '../../common/pipes/uuid-param.pipe';

@ApiTags('Flows')
@Controller('flows')
@UseGuards(AuthGuard('jwt'), AuthorizationsGuard)
@ApiBearerAuth()
export class FlowsController {
  /**
   * Contrôleur pour gérer les flux de transmission.
   * Permet de créer, lire, mettre à jour et supprimer des flux.
   *
   * @param flowsService - Service pour gérer les flux de transmission.
   */
  constructor(private readonly flowsService: FlowsService) {}

  /**
   * Récupère tous les flux de transmission avec pagination et recherche.
   * @param paginationDto - DTO pour la pagination.
   * @returns Un objet contenant les flux et les métadonnées de pagination.
   */
  @Get()
  @Permissions([{ resource: Resource.FLOWS, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Afficher la liste des flux de transmissions' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Recherche par nom/date',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.flowsService.findAll(paginationDto, paginationDto.search);
  }

  /**
   * Crée un nouveau flux de transmission.
   * @param createFlowDto - DTO contenant les informations du flux à créer.
   * @param currentUser - Utilisateur actuel effectuant la création.
   * @returns Le flux créé.
   */
  @Post()
  @Permissions([{ resource: Resource.FLOWS, actions: [Action.CREATE] }])
  @ApiOperation({ summary: 'Créer un flux de transmission' })
  @ApiResponse({
    status: 201,
    description: 'Flux de transmission créé avec succès',
  })
  async create(
    @Body() createFlowDto: CreateFlowDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.flowsService.create(createFlowDto, currentUser.id);
  }

  @Get('flowLists')
  @Permissions([{ resource: Resource.FLOWS, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Afficher la liste des flux de transmission' })
  @ApiResponse({
    status: 200,
    description: 'Liste des flux de transmission récupérée avec succès',
  })
  async findAllForList() {
    return this.flowsService.findAllForList();
  }

  /**
   * Récupère un flux de transmission par son ID.
   * @param id - ID du flux à récupérer.
   * @returns Le flux trouvé.
   */
  @Get(':id')
  @Permissions([{ resource: Resource.FLOWS, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Afficher un flux de transmission par son ID' })
  @ApiResponse({
    status: 200,
    description: 'Flux de transmission récupéré avec succès',
  })
  async findOne(@Param('id', UuidParamPipe) id: string) {
    return this.flowsService.findOne(id);
  }

  /**
   * Met à jour un flux de transmission.
   * @param id - ID du flux à mettre à jour.
   * @param updateFlowDto - DTO contenant les informations mises à jour.
   * @param currentUser - Utilisateur actuel effectuant la mise à jour.
   * @returns Le flux mis à jour.
   */
  @Patch(':id')
  @Permissions([{ resource: Resource.FLOWS, actions: [Action.UPDATE] }])
  @ApiOperation({ summary: 'Mettre à jour le flux de transmission' })
  @ApiResponse({ status: 200, description: 'Flux de transmission mise à jour' })
  @ApiResponse({ status: 404, description: 'Flux de transmission non trouvée' })
  async update(
    @Param('id', UuidParamPipe) id: string,
    @Body() updateFlowDto: UpdateFlowDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.flowsService.update(id, updateFlowDto, currentUser.id);
  }

  /**
   * Supprime un flux de transmission.
   * @param id - ID du flux à supprimer.
   * @param currentUser - Utilisateur actuel effectuant la suppression.
   * @returns Confirmation de la suppression.
   */
  @Delete(':id')
  @Permissions([{ resource: Resource.FLOWS, actions: [Action.DELETE] }])
  @ApiOperation({ summary: 'Supprimer un flux de transmission' })
  @ApiResponse({
    status: 200,
    description: 'Flux de transmission supprimé avec succès',
  })
  async remove(
    @Param('id', UuidParamPipe) id: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.flowsService.remove(id, currentUser.id);
  }
}
