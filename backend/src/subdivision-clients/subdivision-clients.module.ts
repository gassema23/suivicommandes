import { Module } from '@nestjs/common';
import { SubdivisionClientsController } from './subdivision-clients.controller';
import { SubdivisionClientsService } from './subdivision-clients.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubdivisionClient } from './entities/subdivision-client.entity';
import { Client } from 'src/clients/entities/client.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ClientsModule } from 'src/clients/clients.module';

@Module({
  imports: [
      TypeOrmModule.forFeature([SubdivisionClient, Client]), 
      AuthModule,
      ClientsModule
    ],
  controllers: [SubdivisionClientsController],
  providers: [SubdivisionClientsService],
  exports: [SubdivisionClientsService],
})
export class SubdivisionClientsModule {}
