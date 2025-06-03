import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Sector } from 'src/sectors/entities/sectors.entity';
import { SectorsModule } from 'src/sectors/sectors.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service, Sector]), 
    AuthModule,
    SectorsModule
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}
