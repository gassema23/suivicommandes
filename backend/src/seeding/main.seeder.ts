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
    const subdivisionClientCount = 100;
    const holidayCount = 100;

    // Truncate existing data
    await truncateSeed(dataSource);
    // Seed sectors
    const sectors = await sectorSeed(dataSource, factoryManager, sectorCount);
    // Seed services
    const services = await serviceSeed(dataSource, factoryManager, serviceCount, sectors);
    // Seed service categories
    const serviceCategories =  await serviceCategorySeed(dataSource, factoryManager, serviceCategoryCount, services);

    const providers = await providerSeed(dataSource, factoryManager, providerCount);

    const providerServiceCategories = await providerServiceCategorySeed(dataSource, factoryManager, providerServiceCategoryCount, providers, serviceCategories);

    const clients = await clientSeed(dataSource, factoryManager, clientCount);
    const subdivisionClients = await subdivisionClientSeed(dataSource, factoryManager, subdivisionClientCount, clients);
    
    return await holidaySeed(dataSource, factoryManager, holidayCount);
  }
}
