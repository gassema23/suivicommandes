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
import { ProviderServiceCategoriesService } from './provider-service-categories.service';
import { Resource } from 'src/roles/enums/resource.enum';
import { Permissions } from 'src/roles/decorators/permission.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Action } from 'src/roles/enums/action.enum';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateProviderServiceCategoryDto } from './dto/create-provider-service-category.dto';
import { instanceToPlain } from 'class-transformer';

@Controller('provider-service-categories')
@ApiTags('Catégories de services fournisseurs')
@UseGuards(AuthGuard('jwt'), AuthorizationsGuard)
@ApiBearerAuth()
export class ProviderServiceCategoriesController {
  constructor(
    private readonly providerServiceCategoriesService: ProviderServiceCategoriesService,
  ) {}

  @Get()
  @Permissions([
    { resource: Resource.PROVIDER_SERVICE_CATEGORIES, actions: [Action.READ] },
  ])
  @ApiOperation({
    summary: 'Obtenir la liste des catégories de services fournisseurs',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des catégories de services fournisseurs',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Recherche par nom',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.providerServiceCategoriesService.findAll(
      paginationDto,
      paginationDto.search,
    );
    return {
      ...result,
      data: result.data.map((item) => instanceToPlain(item)),
    };
  }

  @Post()
  @Permissions([
    {
      resource: Resource.PROVIDER_SERVICE_CATEGORIES,
      actions: [Action.CREATE],
    },
  ])
  @ApiOperation({
    summary: 'Créer une nouvelle catégories de services fournisseurs',
  })
  @ApiResponse({
    status: 201,
    description: 'Catégorie de service créée avec succès',
  })
  async create(
    @Body() createProviderServiceCategoryDto: CreateProviderServiceCategoryDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.providerServiceCategoriesService.create(
      createProviderServiceCategoryDto,
      currentUser.id,
    );
  }

  @Get(':id')
  @Permissions([
    { resource: Resource.PROVIDER_SERVICE_CATEGORIES, actions: [Action.READ] },
  ])
  @ApiOperation({
    summary: 'Obtenir une catégories de services fournisseurs par son ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Catégories de services fournisseurs trouvée',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.providerServiceCategoriesService.findOne(id);
  }

  @Patch(':id')
  @Permissions([
    {
      resource: Resource.PROVIDER_SERVICE_CATEGORIES,
      actions: [Action.UPDATE],
    },
  ])
  @ApiOperation({
    summary: 'Mettre à jour une catégories de services fournisseurs',
  })
  @ApiResponse({
    status: 200,
    description: 'Catégorie de service mise à jour avec succès',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProviderServiceCategoryDto: CreateProviderServiceCategoryDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.providerServiceCategoriesService.update(
      id,
      updateProviderServiceCategoryDto,
      currentUser.id,
    );
  }

  @Delete()
  @Permissions([
    {
      resource: Resource.PROVIDER_SERVICE_CATEGORIES,
      actions: [Action.DELETE],
    },
  ])
  @ApiOperation({
    summary: 'Supprimer une catégories de services fournisseurs',
  })
  @ApiResponse({
    status: 200,
    description: 'la catégories de services fournisseurs supprimé avec succès',
  })
  async remove(@Body('id') id: string, @CurrentUser() currentUser: User) {
    return this.providerServiceCategoriesService.remove(id, currentUser.id);
  }
}
