import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthorizationsGuard } from 'src/auth/guards/authorizations.guard';
import { SubdivisionClientsService } from './subdivision-clients.service';
import { Resource } from 'src/roles/enums/resource.enum';
import { Action } from 'src/roles/enums/action.enum';
import { Permissions } from 'src/roles/decorators/permission.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { instanceToPlain } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CreateSubdivisionClientDto } from './dto/create-subdivision-client.dto';

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
  @ApiResponse({ status: 201, description: 'Subdivision client créé avec succès' })
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
  @Permissions([{ resource: Resource.SUBDIVISION_CLIENTS, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Afficher une Subdivision client par son ID' })
  @ApiResponse({
    status: 200,
    description: 'Subdivision client récupéré avec succès',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const subdivisionClient = await this.subdivisionClientsService.findOne(id);
    return instanceToPlain(subdivisionClient);
  }
}
