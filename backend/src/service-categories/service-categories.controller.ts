import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthorizationsGuard } from 'src/auth/guards/authorizations.guard';
import { ServiceCategoriesService } from './service-categories.service';
import { Resource } from 'src/roles/enums/resource.enum';
import { Action } from 'src/roles/enums/action.enum';
import { Permissions } from 'src/roles/decorators/permission.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('service-categories')
@ApiTags('Services Categories')
@UseGuards(AuthGuard('jwt'), AuthorizationsGuard)
@ApiBearerAuth()
export class ServiceCategoriesController {
  constructor(
    private readonly serviceCategoriesService: ServiceCategoriesService,
  ) {}

  @Get()
  @Permissions([{ resource: Resource.SERVICE_CATEGORIES, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Obtenir la liste des catégories de services' })
  @ApiResponse({ status: 200, description: 'Liste des catégorie de services' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Recherche par nom',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.serviceCategoriesService.findAll(paginationDto, paginationDto.search);
  }
}
