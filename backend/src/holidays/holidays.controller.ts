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
import { HolidaysService } from './holidays.service';
import { Permissions } from 'src/roles/decorators/permission.decorator';
import { Resource } from 'src/roles/enums/resource.enum';
import { Action } from 'src/roles/enums/action.enum';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';

@ApiTags('Holidays')
@Controller('holidays')
@UseGuards(AuthGuard('jwt'), AuthorizationsGuard)
@ApiBearerAuth()
export class HolidaysController {
  constructor(private readonly holidaysService: HolidaysService) {}

  @Get()
  @Permissions([{ resource: Resource.HOLIDAYS, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Afficher la liste des jours fériés' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Recherche par nom/date',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.holidaysService.findAll(paginationDto, paginationDto.search);
  }

  @Post()
  @Permissions([{ resource: Resource.HOLIDAYS, actions: [Action.CREATE] }])
  @ApiOperation({ summary: 'Créer un jour férié' })
  @ApiResponse({ status: 201, description: 'Jour férié créé avec succès' })
  async create(
    @Body() createHolidayDto: CreateHolidayDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.holidaysService.create(createHolidayDto, currentUser.id);
  }

  @Get(':id')
  @Permissions([{ resource: Resource.HOLIDAYS, actions: [Action.READ] }])
  @ApiOperation({ summary: 'Afficher un jour férié par son ID' })
  @ApiResponse({
    status: 200,
    description: 'Jour férié récupéré avec succès',
  })
  async findOne(@Query('id') id: string) {
    return this.holidaysService.findOne(id);
  }

  @Patch(':id')
  @Permissions([{ resource: Resource.HOLIDAYS, actions: [Action.UPDATE] }])
  @ApiOperation({ summary: 'Mettre à jour le jour férié' })
  @ApiResponse({ status: 200, description: 'Jour férié mise à jour' })
  @ApiResponse({ status: 404, description: 'Jour férié non trouvée' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateHolidayDto: UpdateHolidayDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.holidaysService.update(id, updateHolidayDto, currentUser.id);
  }

  @Delete()
  @Permissions([{ resource: Resource.HOLIDAYS, actions: [Action.DELETE] }])
  @ApiOperation({ summary: 'Supprimer un jour férié' })
  @ApiResponse({ status: 200, description: 'Jour férié supprimé avec succès' })
  async remove(@Body('id') id: string, @CurrentUser() currentUser: User) {
    return this.holidaysService.remove(id, currentUser.id);
  }
}
