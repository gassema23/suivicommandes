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
import { HolidaysService } from '../services/holidays.service';
import { Permissions } from '../../roles/decorators/permission.decorator';
import { Resource } from '../../roles/enums/resource.enum';
import { Action } from '../../roles/enums/action.enum';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';
import { CreateHolidayDto } from '../dto/create-holiday.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { UpdateHolidayDto } from '../dto/update-holiday.dto';
import { UuidParamPipe } from '@/common/pipes/uuid-param.pipe';

@ApiTags('Holidays')
@Controller('holidays')
@UseGuards(AuthGuard('jwt'), AuthorizationsGuard)
@ApiBearerAuth()
export class HolidaysController {
  /**
   * Contrôleur pour gérer les jours fériés.
   * Permet de créer, lire, mettre à jour et supprimer des jours fériés.
   *
   * @param holidaysService - Service pour gérer les jours fériés.
   */
  constructor(private readonly holidaysService: HolidaysService) {}

  /**
   * Récupère tous les jours fériés avec pagination et recherche.
   * @param paginationDto - DTO pour la pagination.
   * @returns Un objet contenant les jours fériés et les métadonnées de pagination.
   */
  @Get()
  @Permissions([{ resource: Resource.HOLIDAYS, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Afficher la liste des jours fériés' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Recherche par nom/date',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.holidaysService.findAll(paginationDto, paginationDto.search);
  }

  /**
   * Crée un nouveau jour férié.
   * @param createHolidayDto - DTO pour créer un jour férié.
   * @param currentUser - Utilisateur actuel effectuant la requête.
   * @returns Le jour férié créé.
   */
  @Post()
  @Permissions([{ resource: Resource.HOLIDAYS, actions: [Action.CREATE] }])
  @ApiOperation({ summary: 'Créer un jour férié' })
  @ApiResponse({ status: 201, description: 'Jour férié créé avec succès' })
  async create(
    @Body() createHolidayDto: CreateHolidayDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.holidaysService.create(createHolidayDto, currentUser.id);
  }

  /**
   * Récupère un jour férié par son ID.
   * @param id - ID du jour férié à récupérer.
   * @returns Le jour férié correspondant à l'ID.
   */
  @Get(':id')
  @Permissions([{ resource: Resource.HOLIDAYS, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Afficher un jour férié par son ID' })
  @ApiResponse({
    status: 200,
    description: 'Jour férié récupéré avec succès',
  })
  async findOne(@Param('id', UuidParamPipe) id: string) {
    return this.holidaysService.findOne(id);
  }

  /**
   * Met à jour un jour férié existant.
   * @param id - ID du jour férié à mettre à jour.
   * @param updateHolidayDto - DTO contenant les nouvelles informations du jour férié.
   * @param currentUser - Utilisateur actuel effectuant la mise à jour.
   * @returns Le jour férié mis à jour.
   */
  @Patch(':id')
  @Permissions([{ resource: Resource.HOLIDAYS, actions: [Action.UPDATE] }])
  @ApiOperation({ summary: 'Mettre à jour le jour férié' })
  @ApiResponse({ status: 200, description: 'Jour férié mise à jour' })
  @ApiResponse({ status: 404, description: 'Jour férié non trouvée' })
  async update(
    @Param('id', UuidParamPipe) id: string,
    @Body() updateHolidayDto: UpdateHolidayDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.holidaysService.update(id, updateHolidayDto, currentUser.id);
  }

  /**
   * Supprime un jour férié par son ID.
   * @param id - ID du jour férié à supprimer.
   * @param currentUser - Utilisateur actuel effectuant la suppression.
   * @returns Confirmation de la suppression du jour férié.
   */
  @Delete(':id')
  @Permissions([{ resource: Resource.HOLIDAYS, actions: [Action.DELETE] }])
  @ApiOperation({ summary: 'Supprimer un jour férié' })
  @ApiResponse({ status: 200, description: 'Jour férié supprimé avec succès' })
  async remove(
    @Param('id', UuidParamPipe) id: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.holidaysService.remove(id, currentUser.id);
  }
}
