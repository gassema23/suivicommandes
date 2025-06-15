import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Client } from './entities/client.entity';
import { SubdivisionClient } from '../subdivision-clients/entities/subdivision-client.entity';
import { ClientsController } from './controllers/clients.controller';
import { ClientsService } from './services/clients.service';

@Module({
  imports: [TypeOrmModule.forFeature([Client, SubdivisionClient]), AuthModule],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
