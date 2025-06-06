import { Module } from '@nestjs/common';
import { ServiceCategoriesController } from './service-categories.controller';
import { ServiceCategoriesService } from './service-categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from '../services/entities/service.entity';
import { AuthModule } from '../auth/auth.module';
import { ServicesModule } from '../services/services.module';
import { ServiceCategory } from './entities/service-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceCategory, Service]), 
    AuthModule,
    ServicesModule
  ],
  controllers: [ServiceCategoriesController],
  providers: [ServiceCategoriesService],
  exports: [ServiceCategoriesService],
})
export class ServiceCategoriesModule {}
