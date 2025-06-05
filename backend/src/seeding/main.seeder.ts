import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { sectorSeed } from './seeders/sector.seed';
import { serviceSeed } from './seeders/service.seed';
import { truncateSeed } from './seeders/truncate.seed';
import { serviceCategorySeed } from './seeders/service-category.seed';

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    
    const sectorCount = 1000;
    const serviceCount = 5000;
    const serviceCategoryCount = 10000;

    // Truncate existing data
    await truncateSeed(dataSource);
    // Seed sectors
    const sectors = await sectorSeed(dataSource, factoryManager, sectorCount);
    // Seed services
    const services = await serviceSeed(dataSource, factoryManager, serviceCount, sectors);
    // Seed service categories
    return await serviceCategorySeed(dataSource, factoryManager, serviceCategoryCount, services);
  }
}
