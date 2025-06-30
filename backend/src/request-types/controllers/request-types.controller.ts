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
import { RequestTypesService } from '../services/request-types.service';
import { Permissions } from '../../roles/decorators/permission.decorator';
import { Resource } from '../../roles/enums/resource.enum';
import { Action } from '../../roles/enums/action.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CreateRequestTypeDto } from '../dto/create-request-type.dto';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';
import { UpdateRequestTypeDto } from '../dto/update-request-type.dto';
import { UuidParamPipe } from '../../common/pipes/uuid-param.pipe';

@ApiTags('Request types')
@Controller('request-types')
@UseGuards(AuthGuard('jwt'), AuthorizationsGuard)
@ApiBearerAuth()
export class RequestTypesController {
  /**
   * Controller for managing request types.
   * Provides endpoints to create, read, update, and delete request types.
   * @param requestTypesService - Service for handling business logic related to request types.
   */
  constructor(private readonly requestTypesService: RequestTypesService) {}

  /**
   * Retrieves all request types with pagination and optional search.
   * @param paginationDto - DTO containing pagination parameters.
   * @returns A paginated result containing request types and metadata.
   */
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

  /**
   * Retrieves a list of request types for the selector.
   * @returns A list of request types with their IDs and names.
   */
  @Get('requestTypeList')
  @Permissions([{ resource: Resource.SECTORS, actions: [Action.READ] }])
  @ApiOperation({
    summary: 'Obtenir la liste des types de demande pour le sélecteur',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des types de demande pour le sélecteur',
  })
  async getSectorsList() {
    return this.requestTypesService.getRequestTypeList();
  }

  /**
   * Creates a new request type.
   * @param createRequestTypeDto - DTO containing the request type details.
   * @param currentUser - The user creating the request type.
   * @returns The created request type.
   */
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

  /**
   * Retrieves a request type by its ID.
   * @param id - ID of the request type to retrieve.
   * @returns The request type corresponding to the provided ID.
   */
  @Get(':id')
  @Permissions([{ resource: Resource.REQUEST_TYPES, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Afficher un type de demande par son ID' })
  @ApiResponse({
    status: 200,
    description: 'Type de demande récupéré avec succès',
  })
  async findOne(@Param('id', UuidParamPipe) id: string) {
    return this.requestTypesService.findOne(id);
  }

  /**
   * Updates an existing request type.
   * Validates the new name to ensure it does not conflict with existing types.
   * @param id - ID of the request type to update.
   * @param updateRequestTypeDto - DTO containing the new details of the request type.
   * @param currentUser - The user updating the request type.
   * @returns The updated request type.
   */
  @Patch(':id')
  @Permissions([{ resource: Resource.REQUEST_TYPES, actions: [Action.UPDATE] }])
  @ApiOperation({ summary: 'Mettre à jour le type de demande' })
  @ApiResponse({ status: 200, description: 'Type de demande mise à jour' })
  @ApiResponse({ status: 404, description: 'Type de demande non trouvée' })
  async update(
    @Param('id', UuidParamPipe) id: string,
    @Body() updateRequestTypeDto: UpdateRequestTypeDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.requestTypesService.update(
      id,
      updateRequestTypeDto,
      currentUser.id,
    );
  }

  /**
   * Deletes a request type.
   * @param id - ID of the request type to delete.
   * @param currentUser - The user deleting the request type.
   * @returns A success message indicating the request type was deleted.
   */
  @Delete(':id')
  @Permissions([{ resource: Resource.REQUEST_TYPES, actions: [Action.DELETE] }])
  @ApiOperation({ summary: 'Supprimer un type de demande' })
  @ApiResponse({
    status: 200,
    description: 'Type de demande supprimé avec succès',
  })
  async remove(
    @Param('id', UuidParamPipe) id: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.requestTypesService.remove(id, currentUser.id);
  }
}
