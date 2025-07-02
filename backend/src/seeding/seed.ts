import { DatabaseConfig } from '../config/database.config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { SectorFactory } from './factories/sector.factory';
import { MainSeeder } from './main.seeder';
import { ServiceFactory } from './factories/service.factory';
import { ServiceCategoryFactory } from './factories/service-category.factory';
import { ProviderFactory } from './factories/provider.factory';
import { ProviderServiceCategoryFactory } from './factories/provider-service-catefory.factory';
import { ClientFactory } from './factories/client.factory';
import { SubdivisionClientFactory } from './factories/subdivision-client.factory';
import { HolidayFactory } from './factories/holiday.factory';

import { RequestTypeFactory } from './factories/request-type.factory';
import { RequestTypeServiceCategoryFactory } from './factories/request-type-service-category.factory';
import { FlowFactory } from './factories/flow.factory';
import { DeliverableFactory } from './factories/deliverable.factory';
import { ConformityTypeFactory } from './factories/conformity-type.factory';
import { DeliverableDelayRequestTypeFactory } from './factories/deliverable-delay-request-type.factory';
import { DeliverableDelayFlowFactory } from './factories/deliverable-delay-flow.factory';

const options: DataSourceOptions & SeederOptions = {
  ...DatabaseConfig,
  factories: [
    SectorFactory,
    ServiceFactory,
    ServiceCategoryFactory,
    RequestTypeFactory,
    RequestTypeServiceCategoryFactory,
    FlowFactory,
    DeliverableFactory,
    ConformityTypeFactory,
    DeliverableDelayRequestTypeFactory,
    DeliverableDelayFlowFactory,
    ProviderFactory,
    ProviderServiceCategoryFactory,
    ClientFactory,
    SubdivisionClientFactory,
    HolidayFactory,
  ],
  seeds: [MainSeeder],
};
console.log('Initialisation du seeder...');
const datasource = new DataSource(options);
datasource.initialize().then(async () => {
  await datasource.synchronize();
  await runSeeders(datasource);
  process.exit();
});
