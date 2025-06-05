import {
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Permissions } from 'src/roles/decorators/permission.decorator';
import { Resource } from 'src/roles/enums/resource.enum';
import { Action } from 'src/roles/enums/action.enum';
import { AuthorizationsGuard } from 'src/auth/guards/authorizations.guard';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { instanceToPlain } from 'class-transformer';
import { AuthGuard } from '@nestjs/passport';

@Controller('roles')
//@UseGuards(AuthGuard('jwt'), AuthorizationsGuard)
@UseGuards(AuthGuard('jwt'))
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  //@Permissions([{ resource: Resource.ROLES, actions: [Action.CREATE] }])
  async createRole(@Body() role: CreateRoleDto) {
    return this.rolesService.create(role);
  }

  @Get()
  @Permissions([{ resource: Resource.ROLES, actions: [Action.READ] }])
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query('search') search?: string,
  ) {
    const result = await this.rolesService.findAll(paginationDto, search);
    return {
      ...result,
      data: result.data.map((role) => instanceToPlain(role)),
    };
  }

  @Get('resources')
  @Permissions([{ resource: Resource.ROLES, actions: [Action.READ] }])
  async getResources() {
    return Object.values(Resource).map((resource) => ({
      value: resource,
      label: resource.charAt(0).toUpperCase() + resource.slice(1),
    }));
  }

  @Get('rolesList')
  @Permissions([{ resource: Resource.ROLES, actions: [Action.READ] }])
  async getRolesList() {
    const roles = await this.rolesService.getRolesList();
    return roles.map((role) => instanceToPlain(role));
  }

  @Get(':id')
  @Permissions([{ resource: Resource.ROLES, actions: [Action.READ] }])
  async findOne(@Param('id') id: string) {
    const role = await this.rolesService.findById(id);
    if (!role) {
      throw new ConflictException('Role not found');
    }
    return instanceToPlain(role);
  }

  @Patch(':id')
  @Permissions([{ resource: Resource.ROLES, actions: [Action.UPDATE] }])
  async updateRole(@Param('id') id: string, @Body() role: CreateRoleDto) {
    const existingRole = await this.rolesService.findById(id);
    if (!existingRole) {
      throw new ConflictException('Role not found');
    }
    return this.rolesService.update(id, role);
  }
}
