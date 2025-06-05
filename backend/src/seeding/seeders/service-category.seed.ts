import { Service } from '../../services/entities/service.entity';
import { SeederFactoryManager } from 'typeorm-extension';
import * as cliProgress from 'cli-progress';
import { DataSource } from 'typeorm';
import { ServiceCategory } from '../../service-categories/entities/service-category.entity';

export async function serviceCategorySeed(
  dataSource: DataSource,
  factoryManager: SeederFactoryManager,
  count: number,
  services: Service[],
): Promise<ServiceCategory[]> {

  const serviceCategoryBar = new cliProgress.SingleBar(
    { format: '{bar} | {name} | {value}/{total}' },
    cliProgress.Presets.shades_classic,
  );
  serviceCategoryBar.start(count, 0, { name: 'Services Categories' });

  const serviceFactory = factoryManager.get(ServiceCategory);
  const serviceCategories: ServiceCategory[] = [];
  for (let i = 0; i < count; i++) {
    const serviceCategory = await serviceFactory.make({
      service: services[Math.floor(Math.random() * services.length)],
    });
    serviceCategories.push(serviceCategory);
    serviceCategoryBar.update(i + 1);
  }
  await dataSource.getRepository(ServiceCategory).save(serviceCategories);
  serviceCategoryBar.stop();
  return serviceCategories;
}
