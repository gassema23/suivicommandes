import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { instanceToPlain } from 'class-transformer';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouvel utilisateur' })
  @ApiResponse({ status: 201, description: 'Utilisateur créé avec succès' })
  @ApiResponse({ status: 409, description: 'Email déjà utilisé' })
  async create(
    @Body() createUserDto: CreateUserDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.usersService.create(createUserDto, currentUser.id);
  }

  @Get()
  @ApiOperation({ summary: 'Obtenir la liste des utilisateurs' })
  @ApiResponse({ status: 200, description: 'Liste des utilisateurs' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Recherche par nom ou email',
  })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query('search') search?: string,
  ) {
    const result = await this.usersService.findAll(paginationDto, search);
    return {
      ...result,
      data: result.data.map((user) => instanceToPlain(user)),
    };
  }

  @Get('usersList')
  @ApiOperation({ summary: 'Obtenir la liste des utilisateurs pour les sélecteurs' })
  @ApiResponse({ status: 200, description: 'Liste des utilisateurs' })
  async getUsersList(@Query('role') role?: string | string[]) {
    const users = await this.usersService.getUsersList(role);
    return users.map((user) => instanceToPlain(user));
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtenir les statistiques des utilisateurs' })
  @ApiResponse({ status: 200, description: 'Statistiques des utilisateurs' })
  async getStats() {
    return this.usersService.getUserStats();
  }

  @Get('search')
  @ApiOperation({ summary: 'Rechercher des utilisateurs' })
  @ApiResponse({ status: 200, description: 'Résultats de recherche' })
  @ApiQuery({ name: 'q', description: 'Terme de recherche' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Nombre de résultats max',
  })
  async search(@Query('q') search: string, @Query('limit') limit?: number) {
    return this.usersService.searchUsers(search, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un utilisateur par ID' })
  @ApiResponse({ status: 200, description: 'Utilisateur trouvé' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un utilisateur' })
  @ApiResponse({ status: 200, description: 'Utilisateur mis à jour' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.usersService.update(id, updateUserDto, currentUser.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un utilisateur' })
  @ApiResponse({ status: 200, description: 'Utilisateur supprimé' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: User,
  ) {
    await this.usersService.remove(id, currentUser.id);
    return { message: 'Utilisateur supprimé avec succès' };
  }
}
