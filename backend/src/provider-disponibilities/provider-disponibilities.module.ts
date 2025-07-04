import { Module } from '@nestjs/common';
import { ProviderDisponibilitiesController } from './controllers/provider-disponibilities.controller';
import { ProviderDisponibilitiesService } from './services/provider-disponibilities.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProviderDisponibility } from './entities/provider-disponibility.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProviderDisponibility]), AuthModule],
  controllers: [ProviderDisponibilitiesController],
  providers: [ProviderDisponibilitiesService],
  exports: [ProviderDisponibilitiesService],
})
export class ProviderDisponibilitiesModule {}
