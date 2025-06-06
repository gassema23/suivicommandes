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
import { ServiceCategoriesService } from './service-categories.service';
import { Resource } from '../roles/enums/resource.enum';
import { Action } from '../roles/enums/action.enum';
import { Permissions } from '../roles/decorators/permission.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';

@Controller('service-categories')
@ApiTags('Services Categories')
@UseGuards(AuthGuard('jwt'), AuthorizationsGuard)
@ApiBearerAuth()
export class ServiceCategoriesController {
  constructor(
    private readonly serviceCategoriesService: ServiceCategoriesService,
  ) {}

  @Get()
  @Permissions([
    { resource: Resource.SERVICE_CATEGORIES, actions: [Action.READ] },
  ])
  @ApiOperation({ summary: 'Obtenir la liste des catégories de services' })
  @ApiResponse({ status: 200, description: 'Liste des catégorie de services' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Recherche par nom',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.serviceCategoriesService.findAll(
      paginationDto,
      paginationDto.search,
    );
  }

  @Post()
  @Permissions([
    { resource: Resource.SERVICE_CATEGORIES, actions: [Action.CREATE] },
  ])
  @ApiOperation({ summary: 'Créer une nouvelle catégorie de service' })
  @ApiResponse({
    status: 201,
    description: 'Catégorie de service créée avec succès',
  })
  async create(
    @Body() createServiceCategoryDto: CreateServiceCategoryDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.serviceCategoriesService.create(
      createServiceCategoryDto,
      currentUser.id,
    );
  }

  @Get(':id')
  @Permissions([
    { resource: Resource.SERVICE_CATEGORIES, actions: [Action.READ] },
  ])
  @ApiOperation({ summary: 'Obtenir une catégorie de service par son ID' })
  @ApiResponse({
    status: 200,
    description: 'Catégorie de service trouvée',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.serviceCategoriesService.findOne(id);
  }

  @Patch(':id')
  @Permissions([
    { resource: Resource.SERVICE_CATEGORIES, actions: [Action.UPDATE] },
  ])
  @ApiOperation({ summary: 'Mettre à jour une catégorie de service' })
  @ApiResponse({
    status: 200,
    description: 'Catégorie de service mise à jour avec succès',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateServiceCategoryDto: CreateServiceCategoryDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.serviceCategoriesService.update(
      id,
      updateServiceCategoryDto,
      currentUser.id,
    );
  }

  @Delete()
  @Permissions([{ resource: Resource.SERVICES, actions: [Action.DELETE] }])
  @ApiOperation({ summary: 'Supprimer une catégorie service' })
  @ApiResponse({ status: 200, description: 'la catégorie de service supprimé avec succès' })
  async remove(@Body('id') id: string, @CurrentUser() currentUser: User) {
    return this.serviceCategoriesService.remove(id, currentUser.id);
  }
}
