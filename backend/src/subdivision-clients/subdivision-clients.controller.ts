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
import { AuthorizationsGuard } from '../auth/guards/authorizations.guard';
import { SubdivisionClientsService } from './subdivision-clients.service';
import { Resource } from '../roles/enums/resource.enum';
import { Action } from '../roles/enums/action.enum';
import { Permissions } from '../roles/decorators/permission.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';
import { instanceToPlain } from 'class-transformer';
import { User } from '../users/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateSubdivisionClientDto } from './dto/create-subdivision-client.dto';
import { UpdateSubdivisionClientDto } from './dto/update-subdivision-client.dto';

@Controller('subdivision-clients')
@ApiTags('Subdivision clients')
@UseGuards(AuthGuard('jwt'), AuthorizationsGuard)
@ApiBearerAuth()
export class SubdivisionClientsController {
  constructor(
    private readonly subdivisionClientsService: SubdivisionClientsService,
  ) {}

  @Get()
  @Permissions([
    { resource: Resource.SUBDIVISION_CLIENTS, actions: [Action.READ] },
  ])
  @ApiOperation({ summary: 'Obtenir la liste des subdivisions clients' })
  @ApiResponse({ status: 200, description: 'Liste des subdivisions clients' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Recherche par nom',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.subdivisionClientsService.findAll(
      paginationDto,
      paginationDto.search,
    );
    return {
      ...result,
      data: result.data.map((subdivisionClient) =>
        instanceToPlain(subdivisionClient),
      ),
    };
  }

  @Post()
  @Permissions([
    { resource: Resource.SUBDIVISION_CLIENTS, actions: [Action.CREATE] },
  ])
  @ApiOperation({ summary: 'Créer une Subdivision client' })
  @ApiResponse({
    status: 201,
    description: 'Subdivision client créé avec succès',
  })
  async create(
    @Body() createSubdivisionClientDto: CreateSubdivisionClientDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.subdivisionClientsService.create(
      createSubdivisionClientDto,
      currentUser.id,
    );
  }

  @Get(':id')
  @Permissions([
    { resource: Resource.SUBDIVISION_CLIENTS, actions: [Action.READ] },
  ])
  @ApiOperation({ summary: 'Afficher une Subdivision client par son ID' })
  @ApiResponse({
    status: 200,
    description: 'Subdivision client récupéré avec succès',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const subdivisionClient = await this.subdivisionClientsService.findOne(id);
    return instanceToPlain(subdivisionClient);
  }

  @Patch(':id')
  @Permissions([{ resource: Resource.SUBDIVISION_CLIENTS, actions: [Action.UPDATE] }])
  @ApiOperation({ summary: 'Mettre à jour la subdivision client' })
  @ApiResponse({
    status: 200,
    description: 'Subdivision client mis à jour avec succès',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSubdivisionClientDto: UpdateSubdivisionClientDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.subdivisionClientsService.update(
      id,
      updateSubdivisionClientDto,
      currentUser.id,
    );
  }

  @Delete()
  @Permissions([{ resource: Resource.SUBDIVISION_CLIENTS, actions: [Action.DELETE] }])
  @ApiOperation({ summary: 'Supprimer un jour férié' })
  @ApiResponse({ status: 200, description: 'Jour férié supprimé avec succès' })
  async remove(@Body('id') id: string, @CurrentUser() currentUser: User) {
    return this.subdivisionClientsService.remove(id, currentUser.id);
  }
}
