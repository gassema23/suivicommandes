import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthorizationsGuard } from 'src/auth/guards/authorizations.guard';
import { SubdivisionClientsService } from './subdivision-clients.service';
import { Resource } from 'src/roles/enums/resource.enum';
import { Action } from 'src/roles/enums/action.enum';
import { Permissions } from 'src/roles/decorators/permission.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('subdivision-clients')
@ApiTags('Subdivision clients')
@UseGuards(AuthGuard('jwt'), AuthorizationsGuard)
@ApiBearerAuth()
export class SubdivisionClientsController {
  constructor(
    private readonly subdivisionClientsService: SubdivisionClientsService,
  ) {}

  @Get()
  @Permissions([{ resource: Resource.SUBDIVISION_CLIENTS, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Obtenir la liste des subdivisions clients' })
  @ApiResponse({ status: 200, description: 'Liste des subdivisions clients' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Recherche par nom',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.subdivisionClientsService.findAll(paginationDto, paginationDto.search);
  }
}
