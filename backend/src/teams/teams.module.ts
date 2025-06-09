import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamsController } from './controllers/teams.controller';
import { Team } from './entities/team.entity';
import { User } from '../users/entities/user.entity';
import { TeamsService } from './services/teams.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Team, User]), AuthModule],
  providers: [TeamsService],
  controllers: [TeamsController],
  exports: [TeamsService],
})
export class TeamsModule {}
