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
import { ConformityTypesService } from './conformity-types.service';
import { Permissions } from '../roles/decorators/permission.decorator';
import { Resource } from '../roles/enums/resource.enum';
import { Action } from '../roles/enums/action.enum';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateConformityTypeDto } from './dto/create-conformity-type.dto';
import { User } from '../users/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateConformityTypeDto } from './dto/update-conformity-type.dto';

@ApiTags('Conformity types')
@Controller('conformity-types')
@UseGuards(AuthGuard('jwt'), AuthorizationsGuard)
@ApiBearerAuth()
export class ConformityTypesController {
  constructor(private readonly conformityTypesService: ConformityTypesService) {}

  @Get()
  @Permissions([{ resource: Resource.CONFORMITY_TYPES, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Afficher la liste des types de conformités' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Recherche par nom/date',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.conformityTypesService.findAll(paginationDto, paginationDto.search);
  }

  @Post()
  @Permissions([{ resource: Resource.CONFORMITY_TYPES, actions: [Action.CREATE] }])
  @ApiOperation({ summary: 'Créer un type de conformité' })
  @ApiResponse({ status: 201, description: 'Type de conformité créé avec succès' })
  async create(
    @Body() createConformityTypeDto: CreateConformityTypeDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.conformityTypesService.create(createConformityTypeDto, currentUser.id);
  }

  @Get(':id')
  @Permissions([{ resource: Resource.CONFORMITY_TYPES, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Afficher un type de conformité par son ID' })
  @ApiResponse({
    status: 200,
    description: 'Type de conformité récupéré avec succès',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.conformityTypesService.findOne(id);
  }

  @Patch(':id')
  @Permissions([{ resource: Resource.CONFORMITY_TYPES, actions: [Action.UPDATE] }])
  @ApiOperation({ summary: 'Mettre à jour le type de conformité' })
  @ApiResponse({ status: 200, description: 'Type de conformité mise à jour' })
  @ApiResponse({ status: 404, description: 'Type de conformité non trouvée' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateConformityTypeDto: UpdateConformityTypeDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.conformityTypesService.update(
      id,
      updateConformityTypeDto,
      currentUser.id,
    );
  }

  @Delete()
  @Permissions([{ resource: Resource.CONFORMITY_TYPES, actions: [Action.DELETE] }])
  @ApiOperation({ summary: 'Supprimer un type de conformité' })
  @ApiResponse({ status: 200, description: 'Type de conformité supprimé avec succès' })
  async remove(@Body('id') id: string, @CurrentUser() currentUser: User) {
    return this.conformityTypesService.remove(id, currentUser.id);
  }
}
