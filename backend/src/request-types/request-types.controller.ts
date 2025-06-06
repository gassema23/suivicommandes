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
import { RequestTypesService } from './request-types.service';
import { Permissions } from '../roles/decorators/permission.decorator';
import { Resource } from '../roles/enums/resource.enum';
import { Action } from '../roles/enums/action.enum';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateRequestTypeDto } from './dto/create-request-type.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { UpdateRequestTypeDto } from './dto/update-request-type.dto';

@ApiTags('Request types')
@Controller('request-types')
@UseGuards(AuthGuard('jwt'), AuthorizationsGuard)
@ApiBearerAuth()
export class RequestTypesController {
  constructor(private readonly requestTypesService: RequestTypesService) {}

  @Get()
  @Permissions([{ resource: Resource.REQUEST_TYPES, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Afficher la liste des types de demandes' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Recherche par nom/date',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.requestTypesService.findAll(
      paginationDto,
      paginationDto.search,
    );
  }

  @Post()
  @Permissions([{ resource: Resource.REQUEST_TYPES, actions: [Action.CREATE] }])
  @ApiOperation({ summary: 'Créer un type de demande' })
  @ApiResponse({ status: 201, description: 'Type de demande créé avec succès' })
  async create(
    @Body() createRequestTypeDto: CreateRequestTypeDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.requestTypesService.create(
      createRequestTypeDto,
      currentUser.id,
    );
  }

  @Get(':id')
  @Permissions([{ resource: Resource.REQUEST_TYPES, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Afficher un type de demande par son ID' })
  @ApiResponse({
    status: 200,
    description: 'Type de demande récupéré avec succès',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.requestTypesService.findOne(id);
  }

  @Patch(':id')
  @Permissions([{ resource: Resource.REQUEST_TYPES, actions: [Action.UPDATE] }])
  @ApiOperation({ summary: 'Mettre à jour le type de demande' })
  @ApiResponse({ status: 200, description: 'Type de demande mise à jour' })
  @ApiResponse({ status: 404, description: 'Type de demande non trouvée' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRequestTypeDto: UpdateRequestTypeDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.requestTypesService.update(
      id,
      updateRequestTypeDto,
      currentUser.id,
    );
  }

  @Delete()
  @Permissions([{ resource: Resource.REQUEST_TYPES, actions: [Action.DELETE] }])
  @ApiOperation({ summary: 'Supprimer un type de demande' })
  @ApiResponse({
    status: 200,
    description: 'Type de demande supprimé avec succès',
  })
  async remove(@Body('id') id: string, @CurrentUser() currentUser: User) {
    return this.requestTypesService.remove(id, currentUser.id);
  }
}
