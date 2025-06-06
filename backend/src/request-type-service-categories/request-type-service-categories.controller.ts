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
import { RequestTypeServiceCategoriesService } from './request-type-service-categories.service';
import { Resource } from '../roles/enums/resource.enum';
import { Permissions } from '../roles/decorators/permission.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Action } from '../roles/enums/action.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { CreateRequestTypeServiceCategoryDto } from './dto/create-request-type-service-category.dto';
import { instanceToPlain } from 'class-transformer';

@Controller('request-type-service-categories')
@ApiTags('Catégories de services fournisseurs')
@UseGuards(AuthGuard('jwt'), AuthorizationsGuard)
@ApiBearerAuth()
export class RequestTypeServiceCategoriesController {
  constructor(
    private readonly requestTypeServiceCategoriesService: RequestTypeServiceCategoriesService,
  ) {}

  @Get()
  @Permissions([
    {
      resource: Resource.REQUEST_TYPE_SERVICE_CATEGORIES,
      actions: [Action.READ],
    },
  ])
  @ApiOperation({
    summary: 'Obtenir la liste des types de demandes par service',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des types de demandes par service obtenue avec succès',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Recherche par nom',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.requestTypeServiceCategoriesService.findAll(
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
      resource: Resource.REQUEST_TYPE_SERVICE_CATEGORIES,
      actions: [Action.CREATE],
    },
  ])
  @ApiOperation({
    summary: 'Créer un type de demandes par service',
  })
  @ApiResponse({
    status: 201,
    description: 'Type de demandes par service créé avec succès',
  })
  async create(
    @Body()
    createRequestTypeServiceCategoryDto: CreateRequestTypeServiceCategoryDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.requestTypeServiceCategoriesService.create(
      createRequestTypeServiceCategoryDto,
      currentUser.id,
    );
  }

  @Get(':id')
  @Permissions([
    {
      resource: Resource.REQUEST_TYPE_SERVICE_CATEGORIES,
      actions: [Action.READ],
    },
  ])
  @ApiOperation({
    summary: 'Obtenir un type de demandes par service par son ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Type de demandes par service trouvé',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.requestTypeServiceCategoriesService.findOne(id);
  }

  @Patch(':id')
  @Permissions([
    {
      resource: Resource.REQUEST_TYPE_SERVICE_CATEGORIES,
      actions: [Action.UPDATE],
    },
  ])
  @ApiOperation({
    summary: 'Mettre à jour un type de demandes par service',
  })
  @ApiResponse({
    status: 200,
    description: 'Type de demandes par service mis à jour avec succès',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body()
    updateRequestTypeServiceCategoryDto: CreateRequestTypeServiceCategoryDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.requestTypeServiceCategoriesService.update(
      id,
      updateRequestTypeServiceCategoryDto,
      currentUser.id,
    );
  }

  @Delete()
  @Permissions([
    {
      resource: Resource.REQUEST_TYPE_SERVICE_CATEGORIES,
      actions: [Action.DELETE],
    },
  ])
  @ApiOperation({
    summary: 'Supprimer un type de demandes par service',
  })
  @ApiResponse({
    status: 200,
    description: 'le type de demandes par service supprimé avec succès',
  })
  async remove(@Body('id') id: string, @CurrentUser() currentUser: User) {
    return this.requestTypeServiceCategoriesService.remove(id, currentUser.id);
  }
}
