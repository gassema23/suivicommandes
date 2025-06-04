import { Module } from '@nestjs/common';
import { ProviderServiceCategoriesController } from './provider-service-categories.controller';
import { ProviderServiceCategoriesService } from './provider-service-categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProviderServiceCategory } from './entities/provider-service-category.entity';
import { Provider } from 'src/providers/entities/provider.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ServiceCategoriesModule } from 'src/service-categories/service-categories.module';
import { ProvidersModule } from 'src/providers/providers.module';
import { ServiceCategory } from 'src/service-categories/entities/service-category.entity';

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
