import { Module } from '@nestjs/common';
import { RequestTypeServiceCategoriesController } from './controllers/request-type-service-categories.controller';
import { RequestTypeServiceCategoriesService } from './services/request-type-service-categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestTypeServiceCategory } from './entities/request-type-service-category.entity';
import { AuthModule } from '../auth/auth.module';
import { RequestType } from '../request-types/entities/request-type.entity';
import { ServiceCategory } from '../service-categories/entities/service-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RequestTypeServiceCategory,
      ServiceCategory,
      RequestType,
    ]),
    AuthModule,
  ],
  controllers: [RequestTypeServiceCategoriesController],
  providers: [RequestTypeServiceCategoriesService],
  exports: [RequestTypeServiceCategoriesService],
})
export class RequestTypeServiceCategoriesModule {}
