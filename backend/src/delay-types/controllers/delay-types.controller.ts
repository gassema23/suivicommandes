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
import { DelayTypesService } from '../services/delay-types.service';
import { Permissions } from '../../roles/decorators/permission.decorator';
import { Resource } from '../../roles/enums/resource.enum';
import { Action } from '../../roles/enums/action.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CreateDelayTypeDto } from '../dto/create-delay-type.dto';
import { User } from '../../users/entities/user.entity';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { UpdateDelayTypeDto } from '../dto/update-delay-type.dto';
import { UuidParamPipe } from '../../common/pipes/uuid-param.pipe';

@ApiTags('Delay types')
@Controller('delay-types')
@UseGuards(AuthGuard('jwt'), AuthorizationsGuard)
@ApiBearerAuth()
export class DelayTypesController {
  /**
   * Controller pour gérer les types de délais.
   * Permet de créer, lire, mettre à jour et supprimer des types de délais.
   * @param delayTypesService - Service pour gérer les opérations liées aux types de délais.
   */
  constructor(private readonly delayTypesService: DelayTypesService) {}

  /**
   * Récupère tous les types de délais avec pagination et recherche.
   * @param paginationDto - DTO de pagination contenant les paramètres de page, limite, tri et ordre.
   * @returns Un objet PaginatedResult contenant les types de délais et les métadonnées de pagination.
   */
  @Get()
  @Permissions([{ resource: Resource.DELAY_TYPES, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Afficher la liste des types de délais' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Recherche par nom/date',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.delayTypesService.findAll(paginationDto, paginationDto.search);
  }

  /**
   * Crée un nouveau type de délai.
   * @param createDelayTypeDto - DTO contenant les informations du type de délai à créer.
   * @param currentUser - Utilisateur actuel effectuant la requête.
   * @returns Le type de délai créé.
   */
  @Post()
  @Permissions([{ resource: Resource.DELAY_TYPES, actions: [Action.CREATE] }])
  @ApiOperation({ summary: 'Créer un type de délai' })
  @ApiResponse({ status: 201, description: 'Type de délai créé avec succès' })
  async create(
    @Body() createDelayTypeDto: CreateDelayTypeDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.delayTypesService.create(createDelayTypeDto, currentUser.id);
  }

  /**
   * Récupère la liste des types de délais.
   * @returns La liste des types de délais.
   */
  @Get('delay-types-list')
  @Permissions([{ resource: Resource.DELAY_TYPES, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Afficher la liste des types de délais' })
  @ApiResponse({
    status: 200,
    description: 'Liste des types de délais récupérée avec succès',
  })
  async getDelayTypesList() {
    return this.delayTypesService.findAllDelayTypesList();
  }

  /**
   * Récupère un type de délai par son ID.
   * @param id - ID du type de délai à récupérer.
   * @returns Le type de délai correspondant à l'ID fourni.
   */
  @Get(':id')
  @Permissions([{ resource: Resource.DELAY_TYPES, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Afficher un type de délai par son ID' })
  @ApiResponse({
    status: 200,
    description: 'Type de délai récupéré avec succès',
  })
  async findOne(@Param('id', UuidParamPipe) id: string) {
    return this.delayTypesService.findOne(id);
  }

  /**
   * Met à jour un type de délai existant.
   * @param id  - ID du type de délai à mettre à jour.
   * @param updateDelayTypeDto  - DTO contenant les informations à mettre à jour.
   * @param currentUser  - Utilisateur actuel effectuant la requête.
   * @returns Le type de délai mis à jour.
   */
  @Patch(':id')
  @Permissions([{ resource: Resource.DELAY_TYPES, actions: [Action.UPDATE] }])
  @ApiOperation({ summary: 'Mettre à jour le type de délai' })
  @ApiResponse({ status: 200, description: 'Type de délai mise à jour' })
  @ApiResponse({ status: 404, description: 'Type de délai non trouvée' })
  async update(
    @Param('id', UuidParamPipe) id: string,
    @Body() updateDelayTypeDto: UpdateDelayTypeDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.delayTypesService.update(
      id,
      updateDelayTypeDto,
      currentUser.id,
    );
  }

  /**
   * Supprime un type de délai par son ID.
   * @param id - ID du type de délai à supprimer.
   * @param currentUser - Utilisateur actuel effectuant la requête.
   * @returns Confirmation de la suppression du type de délai.
   */
  @Delete(':id')
  @Permissions([{ resource: Resource.DELAY_TYPES, actions: [Action.DELETE] }])
  @ApiOperation({ summary: 'Supprimer un type de délai' })
  @ApiResponse({
    status: 200,
    description: 'Type de délai supprimé avec succès',
  })
  async remove(
    @Param('id', UuidParamPipe) id: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.delayTypesService.remove(id, currentUser.id);
  }
}
