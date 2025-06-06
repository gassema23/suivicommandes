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
import { RequisitionTypesService } from './requisition-types.service';
import { Permissions } from '../roles/decorators/permission.decorator';
import { Resource } from '../roles/enums/resource.enum';
import { Action } from '../roles/enums/action.enum';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateRequisitionTypeDto } from './dto/create-requisition-type.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { UpdateRequisitionTypeDto } from './dto/update-requisition-type.dto';

@ApiTags('Requisition types')
@Controller('requisition-types')
@UseGuards(AuthGuard('jwt'), AuthorizationsGuard)
@ApiBearerAuth()
export class RequisitionTypesController {
  constructor(
    private readonly requisitionTypesService: RequisitionTypesService,
  ) {}

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

  @Patch(':id')
  @Permissions([{ resource: Resource.DELAY_TYPES, actions: [Action.UPDATE] }])
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
