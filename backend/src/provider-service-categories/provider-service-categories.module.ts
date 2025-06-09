import { Module } from '@nestjs/common';
import { ProviderServiceCategoriesController } from './controllers/provider-service-categories.controller';
import { ProviderServiceCategoriesService } from './services/provider-service-categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProviderServiceCategory } from './entities/provider-service-category.entity';
import { Provider } from '../providers/entities/provider.entity';
import { AuthModule } from '../auth/auth.module';
import { ServiceCategory } from '../service-categories/entities/service-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServiceCategory,
      Provider,
      ProviderServiceCategory,
    ]),
    AuthModule,
  ],
  controllers: [ProviderServiceCategoriesController],
  providers: [ProviderServiceCategoriesService],
  exports: [ProviderServiceCategoriesService],
})
export class ProviderServiceCategoriesModule {}
