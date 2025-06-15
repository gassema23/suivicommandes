import { Module } from '@nestjs/common';
import { RolesController } from './controllers/roles.controller';
import { RolesService } from './services/roles.service';
import { Role } from './entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Permission } from './entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission]), AuthModule],
  controllers: [RolesController],
  providers: [RolesService, TypeOrmModule],
  exports: [RolesService],
})
export class RolesModule {}
