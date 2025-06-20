import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { AuthorizationsGuard } from '../../auth/guards/authorizations.guard';
import { RequestTypeServiceCategoriesService } from '../services/request-type-service-categories.service';
import { Resource } from '../../roles/enums/resource.enum';
import { Permissions } from '../../roles/decorators/permission.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Action } from '../../roles/enums/action.enum';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';
import { CreateRequestTypeServiceCategoryDto } from '../dto/create-request-type-service-category.dto';
import { instanceToPlain } from 'class-transformer';
import { UpdateRequestTypeServiceCategoryDto } from '../dto/update-request-type-service-category.dto';
import { UuidParamPipe } from '@/common/pipes/uuid-param.pipe';

@Controller('request-type-service-categories')
@ApiTags('Service Provider Categories')
@UseGuards(AuthGuard('jwt'), AuthorizationsGuard)
@ApiBearerAuth()
export class RequestTypeServiceCategoriesController {
  /**
   * Controller for managing request type service categories, including CRUD operations and pagination.
   * @param requestTypeServiceCategoriesService - Service for handling business logic related to request type service categories.
   */
  constructor(
    private readonly requestTypeServiceCategoriesService: RequestTypeServiceCategoriesService,
  ) {}

  /**
   * Controller for managing request type service categories, including retrieving a paginated list with optional search.
   * @param requestTypeServiceCategoriesService - Service for handling request type service categories.
   */
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

  /**
   * Controller for creating a new request type service category.
   * @param createRequestTypeServiceCategoryDto - DTO containing the data for the new request type service category.
   * The `name` field is required and must be a string. The `description` field is optional and must be a string if provided.
   * @param currentUser - The user creating the request type service category.
   */
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

  @Get(':id/deliverable-delay-request-types')
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
  async getDeliverableDelayRequestByRequestTypeServiceCategory(
    @Param('id', UuidParamPipe) id: string,
  ) {
    return this.requestTypeServiceCategoriesService.getDeliverableDelayRequestByRequestTypeServiceCategory(
      id,
    );
  }

  /**
   * Controller for retrieving a specific request type service category by its ID.
   * @param id - The ID of the request type service category to retrieve.
   */
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
  async findOne(@Param('id', UuidParamPipe) id: string) {
    return this.requestTypeServiceCategoriesService.findOne(id);
  }

  /**
   * Controller for updating an existing request type service category.
   * @param id - The ID of the request type service category to update.
   * @param updateRequestTypeServiceCategoryDto - DTO containing the updated data for the request type service category.
   * The `name` field is required and must be a string. The `description` field is optional and must be a string if provided.
   * @param currentUser - The user updating the request type service category.
   */
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
    @Param('id', UuidParamPipe) id: string,
    @Body()
    updateRequestTypeServiceCategoryDto: UpdateRequestTypeServiceCategoryDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.requestTypeServiceCategoriesService.update(
      id,
      updateRequestTypeServiceCategoryDto,
      currentUser.id,
    );
  }

  /**
   * Controller for deleting a request type service category by its ID.
   * @param id - The ID of the request type service category to delete.
   * @param currentUser - The user performing the deletion.
   */
  @Delete(':id')
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
  async remove(
    @Param('id', UuidParamPipe) id: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.requestTypeServiceCategoriesService.remove(id, currentUser.id);
  }
}
