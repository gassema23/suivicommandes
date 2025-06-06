import { Module } from '@nestjs/common';
import { ProviderServiceCategoriesController } from './provider-service-categories.controller';
import { ProviderServiceCategoriesService } from './provider-service-categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProviderServiceCategory } from './entities/provider-service-category.entity';
import { Provider } from '../providers/entities/provider.entity';
import { AuthModule } from '../auth/auth.module';
import { ServiceCategoriesModule } from '../service-categories/service-categories.module';
import { ProvidersModule } from '../providers/providers.module';
import { ServiceCategory } from '../service-categories/entities/service-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServiceCategory,
      Provider,
      ProviderServiceCategory,
    ]),
    AuthModule,
    ServiceCategoriesModule,
    ProvidersModule,
  ],
  controllers: [ProviderServiceCategoriesController],
  providers: [ProviderServiceCategoriesService],
  exports: [ProviderServiceCategoriesService],
})
export class ProviderServiceCategoriesModule {}
