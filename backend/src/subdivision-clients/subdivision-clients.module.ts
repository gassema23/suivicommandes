import { Module } from '@nestjs/common';
import { SubdivisionClientsController } from './controllers/subdivision-clients.controller';
import { SubdivisionClientsService } from './services/subdivision-clients.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubdivisionClient } from './entities/subdivision-client.entity';
import { Client } from '../clients/entities/client.entity';
import { AuthModule } from '../auth/auth.module';

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
