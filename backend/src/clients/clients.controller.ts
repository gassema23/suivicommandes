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
import { ClientsService } from './clients.service';
import { Resource } from 'src/roles/enums/resource.enum';
import { Permissions } from 'src/roles/decorators/permission.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Action } from 'src/roles/enums/action.enum';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('clients')
@ApiTags('Clients')
@UseGuards(AuthGuard('jwt'), AuthorizationsGuard)
@ApiBearerAuth()
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @Permissions([{ resource: Resource.CLIENTS, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Obtenir la liste des clients' })
  @ApiResponse({ status: 200, description: 'Liste des clients' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Recherche par nom',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.clientsService.findAll(paginationDto, paginationDto.search);
  }

  @Post()
  @Permissions([{ resource: Resource.CLIENTS, actions: [Action.CREATE] }])
  @ApiOperation({ summary: 'Créer un client' })
  @ApiResponse({ status: 201, description: 'Client créé avec succès' })
  async create(
    @Body() createClientDto: CreateClientDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.clientsService.create(createClientDto, currentUser.id);
  }

  @Get(':id')
  @Permissions([{ resource: Resource.CLIENTS, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Afficher un client par son ID' })
  @ApiResponse({
    status: 200,
    description: 'Client récupéré avec succès',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @Permissions([{ resource: Resource.HOLIDAYS, actions: [Action.UPDATE] }])
  @ApiOperation({ summary: 'Mettre à jour le jour férié' })
  @ApiResponse({ status: 200, description: 'Jour férié mise à jour' })
  @ApiResponse({ status: 404, description: 'Jour férié non trouvée' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClientDto: UpdateClientDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.clientsService.update(id, updateClientDto, currentUser.id);
  }

  @Delete()
  @Permissions([{ resource: Resource.CLIENTS, actions: [Action.DELETE] }])
  @ApiOperation({ summary: 'Supprimer un client' })
  @ApiResponse({ status: 200, description: 'Client supprimé avec succès' })
  async remove(@Body('id') id: string, @CurrentUser() currentUser: User) {
    return this.clientsService.remove(id, currentUser.id);
  }
}
