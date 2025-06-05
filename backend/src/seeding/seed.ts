import { DatabaseConfig } from '../config/database.config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { SectorFactory } from './factories/sector.factory';
import { MainSeeder } from './main.seeder';
import { ServiceFactory } from './factories/service.factory';
import { ServiceCategoryFactory } from './factories/service-category.factory';

const options: DataSourceOptions & SeederOptions = {
  ...DatabaseConfig,
  factories: [SectorFactory, ServiceFactory, ServiceCategoryFactory],
  seeds: [MainSeeder],
};
console.log('Initialisation du seeder...');
const datasource = new DataSource(options);
datasource.initialize().then(async () => {
  await datasource.synchronize();
  await runSeeders(datasource);
  process.exit();
});
