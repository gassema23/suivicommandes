import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { sectorSeed } from './seeders/sector.seed';
import { serviceSeed } from './seeders/service.seed';
import { truncateSeed } from './seeders/truncate.seed';
import { serviceCategorySeed } from './seeders/service-category.seed';
import { providerSeed } from './seeders/provider.seed';
import { providerServiceCategorySeed } from './seeders/provider-service-category.seed';
import { clientSeed } from './seeders/client.seed';
import { subdivisionClientSeed } from './seeders/subdivision-client.seed';
import { holidaySeed } from './seeders/holiday.seed';
import { requestTypeServiceCategorySeed } from './seeders/request-type-service-category.seed';
import { requestTypeSeed } from './seeders/request-type.seed';
import { flowSeed } from './seeders/flow.seed';
import { deliverableSeed } from './seeders/deliverable.seed';
import { conformityTypeSeed } from './seeders/conformity-type.seed';
import { deliverableDelayRequestTypeSeed } from './seeders/deliverable-delay-request-type.seed';
import { deliverableDelayFlowSeed } from './seeders/deliverable-delay-flow.seed';

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const sectorCount = 10;
    const serviceCount = 50;
    const serviceCategoryCount = 100;
    const providerCount = 20;
    const providerServiceCategoryCount = 20;
    const clientCount = 50;
    const requestTypeCount = 50;
    const subdivisionClientCount = 100;
    const requestTypeServiceCategoryCount = 100;
    const flowCount = 50;
    const deliverableCount = 50;
    const conformityTypeCount = 10;
    const deliverableDelayRequestTypeCount = 100;
    const deliverableDelayFlowCount = 100;

    // Truncate existing data
    await truncateSeed(dataSource);
    // Seed sectors
    const sectors = await sectorSeed(dataSource, factoryManager, sectorCount);
    // Seed services
    const services = await serviceSeed(
      dataSource,
      factoryManager,
      serviceCount,
      sectors,
    );
    // Seed service categories
    const serviceCategories = await serviceCategorySeed(
      dataSource,
      factoryManager,
      requestTypeServiceCategoryCount,
      services,
    );

    const requestTypes = await requestTypeSeed(
      dataSource,
      factoryManager,
      requestTypeCount,
    );

    const requestTypeServiceCategories = await requestTypeServiceCategorySeed(
      dataSource,
      factoryManager,
      serviceCategoryCount,
      serviceCategories,
      requestTypes,
    );

    const flows = await flowSeed(dataSource, factoryManager, flowCount);
    const deliverables = await deliverableSeed(
      dataSource,
      factoryManager,
      deliverableCount,
    );
    const conformityTypes = await conformityTypeSeed(
      dataSource,
      factoryManager,
      conformityTypeCount,
    );

    const deliverableDelayRequestTypes = await deliverableDelayRequestTypeSeed(
      dataSource,
      factoryManager,
      deliverableDelayRequestTypeCount,
      requestTypeServiceCategories,
      deliverables,
    );

    const deliverableDelayFlows = await deliverableDelayFlowSeed(
      dataSource,
      factoryManager,
      deliverableDelayFlowCount,
      deliverableDelayRequestTypes,
      flows,
    );

    const providers = await providerSeed(
      dataSource,
      factoryManager,
      providerCount,
    );

    await providerServiceCategorySeed(
      dataSource,
      factoryManager,
      providerServiceCategoryCount,
      providers,
      serviceCategories,
    );

    const clients = await clientSeed(dataSource, factoryManager, clientCount);
    await subdivisionClientSeed(
      dataSource,
      factoryManager,
      subdivisionClientCount,
      clients,
    );

    // ✅ Seed holidays from CSV for multiple years
    await holidaySeed(dataSource, factoryManager, [2024, 2025, 2026]);
  }
}
