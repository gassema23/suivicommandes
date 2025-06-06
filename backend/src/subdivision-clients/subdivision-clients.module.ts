import { Module } from '@nestjs/common';
import { SubdivisionClientsController } from './subdivision-clients.controller';
import { SubdivisionClientsService } from './subdivision-clients.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubdivisionClient } from './entities/subdivision-client.entity';
import { Client } from '../clients/entities/client.entity';
import { AuthModule } from '../auth/auth.module';
import { ClientsModule } from '../clients/clients.module';

@Module({
  imports: [
      TypeOrmModule.forFeature([SubdivisionClient, Client]), 
      AuthModule,
    ],
  controllers: [SubdivisionClientsController],
  providers: [SubdivisionClientsService],
  exports: [SubdivisionClientsService],
})
export class SubdivisionClientsModule {}
