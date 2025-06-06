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
import { FlowsService } from './flows.service';
import { Permissions } from '../roles/decorators/permission.decorator';
import { Resource } from '../roles/enums/resource.enum';
import { Action } from '../roles/enums/action.enum';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateFlowDto } from './dto/create-flow.dto';
import { User } from '../users/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateFlowDto } from './dto/update-flow.dto';

@ApiTags('Flows')
@Controller('flows')
@UseGuards(AuthGuard('jwt'), AuthorizationsGuard)
@ApiBearerAuth()
export class FlowsController {
  constructor(private readonly flowsService: FlowsService) {}

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

  @Post()
  @Permissions([{ resource: Resource.FLOWS, actions: [Action.CREATE] }])
  @ApiOperation({ summary: 'Créer un flux de transmission' })
  @ApiResponse({ status: 201, description: 'Flux de transmission créé avec succès' })
  async create(
    @Body() createFlowDto: CreateFlowDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.flowsService.create(createFlowDto, currentUser.id);
  }

  @Get(':id')
  @Permissions([{ resource: Resource.FLOWS, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Afficher un flux de transmission par son ID' })
  @ApiResponse({
    status: 200,
    description: 'Flux de transmission récupéré avec succès',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.flowsService.findOne(id);
  }

  @Patch(':id')
  @Permissions([{ resource: Resource.FLOWS, actions: [Action.UPDATE] }])
  @ApiOperation({ summary: 'Mettre à jour le flux de transmission' })
  @ApiResponse({ status: 200, description: 'Flux de transmission mise à jour' })
  @ApiResponse({ status: 404, description: 'Flux de transmission non trouvée' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFlowDto: UpdateFlowDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.flowsService.update(
      id,
      updateFlowDto,
      currentUser.id,
    );
  }

  @Delete()
  @Permissions([{ resource: Resource.FLOWS, actions: [Action.DELETE] }])
  @ApiOperation({ summary: 'Supprimer un flux de transmission' })
  @ApiResponse({ status: 200, description: 'Flux de transmission supprimé avec succès' })
  async remove(@Body('id') id: string, @CurrentUser() currentUser: User) {
    return this.flowsService.remove(id, currentUser.id);
  }
}
