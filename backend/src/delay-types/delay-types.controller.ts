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
import { DelayTypesService } from './delay-types.service';
import { Permissions } from '../roles/decorators/permission.decorator';
import { Resource } from '../roles/enums/resource.enum';
import { Action } from '../roles/enums/action.enum';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateDelayTypeDto } from './dto/create-delay-type.dto';
import { User } from '../users/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateDelayTypeDto } from './dto/update-delay-type.dto';

@ApiTags('Delay types')
@Controller('delay-types')
@UseGuards(AuthGuard('jwt'), AuthorizationsGuard)
@ApiBearerAuth()
export class DelayTypesController {
  constructor(private readonly delayTypesService: DelayTypesService) {}

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

  @Get(':id')
  @Permissions([{ resource: Resource.DELAY_TYPES, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Afficher un type de délai par son ID' })
  @ApiResponse({
    status: 200,
    description: 'Type de délai récupéré avec succès',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.delayTypesService.findOne(id);
  }

  @Patch(':id')
  @Permissions([{ resource: Resource.DELAY_TYPES, actions: [Action.UPDATE] }])
  @ApiOperation({ summary: 'Mettre à jour le type de délai' })
  @ApiResponse({ status: 200, description: 'Type de délai mise à jour' })
  @ApiResponse({ status: 404, description: 'Type de délai non trouvée' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDelayTypeDto: UpdateDelayTypeDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.delayTypesService.update(
      id,
      updateDelayTypeDto,
      currentUser.id,
    );
  }

  @Delete()
  @Permissions([{ resource: Resource.DELAY_TYPES, actions: [Action.DELETE] }])
  @ApiOperation({ summary: 'Supprimer un type de délai' })
  @ApiResponse({ status: 200, description: 'Type de délai supprimé avec succès' })
  async remove(@Body('id') id: string, @CurrentUser() currentUser: User) {
    return this.delayTypesService.remove(id, currentUser.id);
  }
}
