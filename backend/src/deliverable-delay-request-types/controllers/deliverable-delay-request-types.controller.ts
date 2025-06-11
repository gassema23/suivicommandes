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
import { AuthorizationsGuard } from '../../auth/guards/authorizations.guard';
import { DeliverableDelayRequestTypesService } from '../services/deliverable-delay-request-types.service';
import { Permissions } from '../../roles/decorators/permission.decorator';
import { Resource } from '../../roles/enums/resource.enum';
import { Action } from '../../roles/enums/action.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { instanceToPlain } from 'class-transformer';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { CreateDeliverableDelayRequestTypeDto } from '../dto/create-deliverable-delay-request-type.dto';
import { User } from '../../users/entities/user.entity';
import { UpdateDeliverableDelayRequestTypeDto } from '../dto/update-deliverable-delay-request-type.dto';

@Controller('deliverable-delay-request-types')
@ApiTags('Deliverable Delay Request Types')
@UseGuards(AuthGuard('jwt'), AuthorizationsGuard)
@ApiBearerAuth()
export class DeliverableDelayRequestTypesController {
  /**
   * Controller for managing deliverable delay request types, including CRUD operations and pagination.
   * @param deliverableDelayRequestTypeService - Service for handling business logic related to deliverable delay request types.
   */
  constructor(
    private readonly deliverableDelayRequestTypeService: DeliverableDelayRequestTypesService,
  ) {}

  /**
   * Retrieves a list of deliverable delay request types with optional pagination and search.
   * @param paginationDto - DTO for pagination and search parameters.
   * @returns An object containing the list of deliverable delay request types and pagination metadata.
   */
  @Get()
  @Permissions([
    {
      resource: Resource.DELIVERABLE_DELAY_REQUEST_TYPES,
      actions: [Action.READ],
    },
  ])
  @ApiOperation({
    summary: 'Obtenir la liste des types de demandes des livrables',
  })
  @ApiResponse({
    status: 200,
    description:
      'Liste des types de demandes des livrables obtenue avec succès',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Recherche par nom',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.deliverableDelayRequestTypeService.findAll(
      paginationDto,
      paginationDto.search,
    );
    return {
      ...result,
      data: result.data.map((item) => instanceToPlain(item)),
    };
  }

  /**
   * Creates a new deliverable delay request type.
   * @param createDeliverableDelayRequestTypeDto - DTO containing the data for the new deliverable delay request type.
   * @param currentUser - The user creating the request type.
   * @returns The created deliverable delay request type.
   */
  @Post()
  @Permissions([
    {
      resource: Resource.DELIVERABLE_DELAY_REQUEST_TYPES,
      actions: [Action.CREATE],
    },
  ])
  @ApiOperation({
    summary: 'Créer un type de demandes par livrable',
  })
  @ApiResponse({
    status: 201,
    description: 'Type de demandes par livrable créé avec succès',
  })
  async create(
    @Body()
    createDeliverableDelayRequestTypeDto: CreateDeliverableDelayRequestTypeDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.deliverableDelayRequestTypeService.create(
      createDeliverableDelayRequestTypeDto,
      currentUser.id,
    );
  }

  /**
   * Retrieves a deliverable delay request type by its ID.
   * @param id - The ID of the deliverable delay request type to retrieve.
   * @returns The deliverable delay request type found.
   */
  @Get(':id')
  @Permissions([
    {
      resource: Resource.DELIVERABLE_DELAY_REQUEST_TYPES,
      actions: [Action.READ],
    },
  ])
  @ApiOperation({
    summary: 'Obtenir un type de demandes par livrable par son ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Type de demandes par livrable trouvé',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.deliverableDelayRequestTypeService.findOne(id);
  }

  /**
   * Updates a deliverable delay request type by its ID.
   * @param id - The ID of the deliverable delay request type to update.
   * @param updateDeliverableDelayRequestTypeDto - DTO containing the updated data.
   * @param currentUser - The user updating the request type.
   * @returns The updated deliverable delay request type.
   */
  @Patch(':id')
  @Permissions([
    {
      resource: Resource.DELIVERABLE_DELAY_REQUEST_TYPES,
      actions: [Action.UPDATE],
    },
  ])
  @ApiOperation({
    summary: 'Mettre à jour un type de demandes par livrable',
  })
  @ApiResponse({
    status: 200,
    description: 'Type de demandes par livrable mis à jour avec succès',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body()
    updateDeliverableDelayRequestTypeDto: UpdateDeliverableDelayRequestTypeDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.deliverableDelayRequestTypeService.update(
      id,
      updateDeliverableDelayRequestTypeDto,
      currentUser.id,
    );
  }

  /**
   * Deletes a deliverable delay request type by its ID.
   * @param id - The ID of the deliverable delay request type to delete.
   * @param currentUser - The user deleting the request type.
   * @returns A confirmation message indicating successful deletion.
   */
  @Delete()
  @Permissions([
    {
      resource: Resource.DELIVERABLE_DELAY_REQUEST_TYPES,
      actions: [Action.DELETE],
    },
  ])
  @ApiOperation({
    summary: 'Supprimer un type de demandes par livrable',
  })
  @ApiResponse({
    status: 200,
    description: 'le type de demandes par livrable supprimé avec succès',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.deliverableDelayRequestTypeService.remove(id, currentUser.id);
  }
}
