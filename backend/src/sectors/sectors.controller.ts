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
import { AuthorizationsGuard } from 'src/auth/guards/authorizations.guard';
import { SectorsService } from './sectors.service';
import { Permissions } from 'src/roles/decorators/permission.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Resource } from 'src/roles/enums/resource.enum';
import { Action } from 'src/roles/enums/action.enum';
import { CreateSectorDto } from './dto/create-sector.dto';
import { User } from 'src/users/entities/user.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UpdateSectorDto } from './dto/update-sector.dto';

@Controller('sectors')
@ApiTags('Sectors')
@UseGuards(AuthGuard('jwt'), AuthorizationsGuard)
@ApiBearerAuth()
export class SectorsController {
  constructor(private readonly sectorsService: SectorsService) {}

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

  @Get('sectorsList')
  @Permissions([{ resource: Resource.SECTORS, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Obtenir la liste des secteurs pour le sélecteur' })
  @ApiResponse({ status: 200, description: 'Liste des secteurs pour le sélecteur' })
  async getSectorsList() {
    return this.sectorsService.getSectorsList();
  }

  @Get(':id/services')
  @Permissions([{ resource: Resource.SECTORS, actions: [Action.READ] }, { resource: Resource.SERVICES, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Obtenir les services d’un secteur par son ID' })
  @ApiResponse({
    status: 200,
    description: 'Services du secteur récupérés avec succès',
  })
  async getServicesBySectorId(@Param('id', ParseUUIDPipe) id: string) {
    return this.sectorsService.getServicesBySectorId(id);
  }

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

  @Get(':id')
  @Permissions([{ resource: Resource.SECTORS, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Afficher un jour férié par son ID' })
  @ApiResponse({
    status: 200,
    description: 'Jour férié récupéré avec succès',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.sectorsService.findOne(id);
  }

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

  @Delete()
  @Permissions([{ resource: Resource.SECTORS, actions: [Action.DELETE] }])
  @ApiOperation({ summary: 'Supprimer un secteur' })
  @ApiResponse({ status: 200, description: 'le secteur supprimé avec succès' })
  async remove(@Body('id') id: string, @CurrentUser() currentUser: User) {
    return this.sectorsService.remove(id, currentUser.id);
  }

}
