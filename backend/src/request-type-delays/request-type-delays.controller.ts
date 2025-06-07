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
import { RequestTypeDelaysService } from './request-type-delays.service';
import { Permissions } from '../roles/decorators/permission.decorator';
import { Resource } from '../roles/enums/resource.enum';
import { Action } from '../roles/enums/action.enum';
import { PaginationDto } from '../common/dto/pagination.dto';
import { instanceToPlain } from 'class-transformer';
import { CreateRequestTypeDelayDto } from './dto/create-request-type-delay.dto';
import { User } from '../users/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateRequestTypeDelayDto } from './dto/update-request-type-delay.dto';

@Controller('request-type-delays')
@ApiTags('Délai des types de demandes')
@UseGuards(AuthGuard('jwt'), AuthorizationsGuard)
@ApiBearerAuth()
export class RequestTypeDelaysController {
  /**
   * Controller for managing request type delays.
   * @param requestTypeDelayService - Service for handling request type delays.
   */
  constructor(
    private readonly requestTypeDelayService: RequestTypeDelaysService,
  ) {}

  /**
   * Controller for managing request type delays, including retrieving a paginated list with optional search.
   * @param requestTypeDelays - Service for handling request type delays.
   */
  @Get()
  @Permissions([
    { resource: Resource.REQUEST_TYPE_DELAYS, actions: [Action.READ] },
  ])
  @ApiOperation({
    summary: 'Obtenir la liste des délais des types de demandes',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des délais des types de demandes obtenue avec succès',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Recherche par nom',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.requestTypeDelayService.findAll(
      paginationDto,
      paginationDto.search,
    );
    return {
      ...result,
      data: result.data.map((item) => instanceToPlain(item)),
    };
  }

  /**
   * Controller for creating a new request type delay.
   * @param createRequestTypeDelayDto - Data transfer object for creating a request type delay.
   * @param currentUser - The user creating the request type delay.
   */
  @Post()
  @Permissions([
    {
      resource: Resource.REQUEST_TYPE_DELAYS,
      actions: [Action.CREATE],
    },
  ])
  @ApiOperation({
    summary: 'Créer un type de délai pour un type de demande',
  })
  @ApiResponse({
    status: 201,
    description: 'Type de délai pour un type de demande créé avec succès',
  })
  async create(
    @Body()
    createRequestTypeDelayDto: CreateRequestTypeDelayDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.requestTypeDelayService.create(
      createRequestTypeDelayDto,
      currentUser.id,
    );
  }

  /**
   * Controller for retrieving a specific request type delay by its ID.
   * @param id - The ID of the request type delay to retrieve.
   */
  @Get(':id')
  @Permissions([
    {
      resource: Resource.REQUEST_TYPE_DELAYS,
      actions: [Action.READ],
    },
  ])
  @ApiOperation({
    summary: 'Obtenir un type de délai par type de demande par son ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Type de délai par type de demande trouvé',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.requestTypeDelayService.findOne(id);
  }

  /**
   * Controller for updating a specific request type delay by its ID.
   * @param id - The ID of the request type delay to update.
   * @param updateRequestTypeDelayDto - Data transfer object containing the updated details.
   * @param currentUser - The user updating the request type delay.
   */
  @Patch(':id')
  @Permissions([
    {
      resource: Resource.REQUEST_TYPE_DELAYS,
      actions: [Action.UPDATE],
    },
  ])
  @ApiOperation({
    summary: 'Mettre à jour un type de délai par type de demande',
  })
  @ApiResponse({
    status: 200,
    description: 'Type de délai par type de demande mis à jour avec succès',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body()
    updateRequestTypeDelayDto: UpdateRequestTypeDelayDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.requestTypeDelayService.update(
      id,
      updateRequestTypeDelayDto,
      currentUser.id,
    );
  }

  /**
   * Controller for deleting a specific request type delay by its ID.
   * @param id - The ID of the request type delay to delete.
   * @param currentUser - The user deleting the request type delay.
   */
  @Delete()
  @Permissions([
    {
      resource: Resource.REQUEST_TYPE_DELAYS,
      actions: [Action.DELETE],
    },
  ])
  @ApiOperation({
    summary: 'Supprimer un type de délai par type de demande',
  })
  @ApiResponse({
    status: 200,
    description: 'le type de délai par type de demand supprimé avec succès',
  })
  async remove(@Body('id') id: string, @CurrentUser() currentUser: User) {
    return this.requestTypeDelayService.remove(id, currentUser.id);
  }
}
