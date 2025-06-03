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
import { ServicesService } from './services.service';
import { Permissions } from 'src/roles/decorators/permission.decorator';
import { Resource } from 'src/roles/enums/resource.enum';
import { Action } from 'src/roles/enums/action.enum';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { User } from 'src/users/entities/user.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CreateServiceDto } from './dto/create-service.dto';

@Controller('services')
@ApiTags('Services')
@UseGuards(AuthGuard('jwt'), AuthorizationsGuard)
@ApiBearerAuth()
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @Permissions([{ resource: Resource.SERVICES, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Obtenir la liste des services' })
  @ApiResponse({ status: 200, description: 'Liste des services' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Recherche par nom',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.servicesService.findAll(paginationDto, paginationDto.search);
  }

  @Post()
  @Permissions([{ resource: Resource.SERVICES, actions: [Action.CREATE] }])
  @ApiOperation({ summary: 'Créer un nouveau service' })
  @ApiResponse({ status: 201, description: 'Service créé avec succès' })
  async create(
    @Body() createServiceDto: CreateServiceDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.servicesService.create(createServiceDto, currentUser.id);
  }

  @Patch(':id')
  @Permissions([{ resource: Resource.SERVICES, actions: [Action.UPDATE] }])
  @ApiOperation({ summary: 'Mettre à jour un service' })
  @ApiResponse({ status: 200, description: 'Service mis à jour avec succès' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateServiceDto: CreateServiceDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.servicesService.update(id, updateServiceDto, currentUser.id);
  }

  @Get('servicesList')
  @Permissions([{ resource: Resource.SERVICES, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Obtenir la liste des services pour un select' })
  @ApiResponse({ status: 200, description: 'Liste des services pour un select' })
  async getServicesList() {
    return this.servicesService.getServicesList();
  }

  @Get(':id')
  @Permissions([{ resource: Resource.SERVICES, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Obtenir un service par son ID' })
  @ApiResponse({ status: 200, description: 'Service trouvé' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicesService.findOne(id);
  }

  @Delete()
  @Permissions([{ resource: Resource.SERVICES, actions: [Action.DELETE] }])
  @ApiOperation({ summary: 'Supprimer un service' })
  @ApiResponse({ status: 200, description: 'le service supprimé avec succès' })
  async remove(@Body('id') id: string, @CurrentUser() currentUser: User) {
    return this.servicesService.remove(id, currentUser.id);
  }
}
