import { AuthorizationsGuard } from '../../auth/guards/authorizations.guard';
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
import { DeliverableDelayFlowsService } from '../services/deliverable-delay-flows.service';
import { Permissions } from '../../roles/decorators/permission.decorator';
import { Resource } from '../../roles/enums/resource.enum';
import { Action } from '../../roles/enums/action.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { instanceToPlain } from 'class-transformer';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';
import { CreateDeliverableDelayFlowDto } from '../dto/create-deliverable-delay-flow.dto';
import { UuidParamPipe } from '../../common/pipes/uuid-param.pipe';

@Controller('deliverable-delay-flows')
@ApiTags('Deliverable Delay flows')
@UseGuards(AuthGuard('jwt'), AuthorizationsGuard)
@ApiBearerAuth()
export class DeliverableDelayFlowsController {
  constructor(
    private readonly deliverableDelayFlowService: DeliverableDelayFlowsService,
  ) {}

  /**
   * Obtenir la liste des types de demandes des flux de livraisons
   * @param paginationDto DTO de pagination
   * @returns Liste paginée des types de demandes des flux de livraisons
   */
  @Get()
  @Permissions([
    {
      resource: Resource.DELIVERABLE_DELAY_FLOWS,
      actions: [Action.READ],
    },
  ])
  @ApiOperation({
    summary: 'Obtenir la liste des types de demandes des flux de livraisons',
  })
  @ApiResponse({
    status: 200,
    description:
      'Liste des types de demandes des flux de livraisons obtenue avec succès',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Recherche par nom',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.deliverableDelayFlowService.findAll(
      paginationDto,
      paginationDto.search,
    );
    return {
      ...result,
      data: result.data.map((item) => instanceToPlain(item)),
    };
  }

  /**
   * Créer un nouveau type de demande de flux de livraisons
   * @param createDeliverableDelayFlowDto DTO de création
   * @param currentUser Utilisateur actuel
   * @returns Le type de demande de flux de livraisons créé
   */
  @Post()
  @Permissions([
    {
      resource: Resource.DELIVERABLE_DELAY_FLOWS,
      actions: [Action.CREATE],
    },
  ])
  @ApiOperation({
    summary: 'Créer un nouveau flux de livraisons',
  })
  @ApiResponse({
    status: 201,
    description: 'Flux de livraisons créé avec succès',
  })
  async create(
    @Body()
    createDeliverableDelayFlowDto: CreateDeliverableDelayFlowDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.deliverableDelayFlowService.create(
      createDeliverableDelayFlowDto,
      currentUser.id,
    );
  }

  /**
   * Obtenir un type de demande de flux de livraisons par son identifiant
   * @param id Identifiant du type de demande de flux de livraisons
   * @returns Le type de demande de flux de livraisons trouvé
   */
  @Get(':id')
  @Permissions([
    {
      resource: Resource.DELIVERABLE_DELAY_FLOWS,
      actions: [Action.READ],
    },
  ])
  @ApiOperation({
    summary: 'Flux de livraisons',
  })
  @ApiResponse({
    status: 200,
    description: 'Flux de livraisons mis à jour avec succès',
  })
  async findOne(@Param('id', UuidParamPipe) id: string) {
    return this.deliverableDelayFlowService.findOne(id);
  }

  /**
   * Mettre à jour un type de demande de flux de livraisons
   * @param id Identifiant du type de demande de flux de livraisons
   * @param updateDeliverableDelayFlowDto DTO de mise à jour
   * @param currentUser Utilisateur actuel
   * @returns Le type de demande de flux de livraisons mis à jour
   */
  @Patch(':id')
  @Permissions([
    {
      resource: Resource.DELIVERABLE_DELAY_FLOWS,
      actions: [Action.UPDATE],
    },
  ])
  @ApiOperation({
    summary: 'Mettre à jour un flux de livraisons',
  })
  @ApiResponse({
    status: 200,
    description: 'Flux de livraisons mis à jour avec succès',
  })
  async update(
    @Param('id', UuidParamPipe) id: string,
    @Body() updateDeliverableDelayFlowDto: CreateDeliverableDelayFlowDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.deliverableDelayFlowService.update(
      id,
      updateDeliverableDelayFlowDto,
      currentUser.id,
    );
  }

  @Delete(':id')
  @Permissions([
    {
      resource: Resource.DELIVERABLE_DELAY_FLOWS,
      actions: [Action.DELETE],
    },
  ])
  @ApiOperation({
    summary: 'Supprimer un flux de livraisons',
  })
  @ApiResponse({
    status: 204,
    description: 'Flux de livraisons supprimé avec succès',
  })
  async remove(
    @Param('id', UuidParamPipe) id: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.deliverableDelayFlowService.remove(id, currentUser.id);
  }
}
