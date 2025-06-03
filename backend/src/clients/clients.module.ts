import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Client } from './entities/client.entity';
import { SubdivisionClient } from 'src/subdivision-clients/entities/subdivision-client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, SubdivisionClient]), AuthModule],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
