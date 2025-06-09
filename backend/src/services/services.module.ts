import { Module } from '@nestjs/common';
import { ServicesController } from './controllers/services.controller';
import { ServicesService } from './services/services.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { AuthModule } from '../auth/auth.module';
import { Sector } from '../sectors/entities/sectors.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Service, Sector]), AuthModule],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}
