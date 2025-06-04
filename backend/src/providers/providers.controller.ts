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
import { ProvidersService } from './providers.service';
import { Resource } from 'src/roles/enums/resource.enum';
import { Action } from 'src/roles/enums/action.enum';
import { Permissions } from 'src/roles/decorators/permission.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateProviderDto } from './dto/create-provider.dto';
import { User } from 'src/users/entities/user.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UpdateProviderDto } from './dto/update-provider.dto';

@ApiTags('Providers')
@Controller('providers')
@UseGuards(AuthGuard('jwt'), AuthorizationsGuard)
@ApiBearerAuth()
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Get()
  @Permissions([{ resource: Resource.PROVIDERS, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Afficher la liste des fournisseurs' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Recherche par nom/date',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.providersService.findAll(paginationDto, paginationDto.search);
  }

  @Post()
  @Permissions([{ resource: Resource.PROVIDERS, actions: [Action.CREATE] }])
  @ApiOperation({ summary: 'Créer un fournisseur' })
  @ApiResponse({ status: 201, description: 'Fournisseur créé avec succès' })
  async create(
    @Body() createProviderDto: CreateProviderDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.providersService.create(createProviderDto, currentUser.id);
  }

  @Get(':id')
  @Permissions([{ resource: Resource.PROVIDERS, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Afficher un fournisseur par son ID' })
  @ApiResponse({
    status: 200,
    description: 'Fournisseur récupéré avec succès',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.providersService.findOne(id);
  }

  @Patch(':id')
  @Permissions([{ resource: Resource.PROVIDERS, actions: [Action.UPDATE] }])
  @ApiOperation({ summary: 'Mettre à jour le fournisseur' })
  @ApiResponse({ status: 200, description: 'Fournisseur mise à jour' })
  @ApiResponse({ status: 404, description: 'Fournisseur non trouvée' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProviderDto: UpdateProviderDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.providersService.update(id, updateProviderDto, currentUser.id);
  }

  @Delete()
  @Permissions([{ resource: Resource.PROVIDERS, actions: [Action.DELETE] }])
  @ApiOperation({ summary: 'Supprimer un fournisseur' })
  @ApiResponse({ status: 200, description: 'Fournisseur supprimé avec succès' })
  async remove(@Body('id') id: string, @CurrentUser() currentUser: User) {
    return this.providersService.remove(id, currentUser.id);
  }
}
