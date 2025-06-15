import { SeederFactoryManager } from 'typeorm-extension';
import * as cliProgress from 'cli-progress';
import { DataSource } from 'typeorm';
import { ServiceCategory } from '../../service-categories/entities/service-category.entity';
import { ProviderServiceCategory } from '../../provider-service-categories/entities/provider-service-category.entity';
import { Provider } from '../../providers/entities/provider.entity';

export async function providerServiceCategorySeed(
  dataSource: DataSource,
  factoryManager: SeederFactoryManager,
  count: number,
  providers: Provider[],
  serviceCategories: ServiceCategory[],
): Promise<ProviderServiceCategory[]> {

  const bar = new cliProgress.SingleBar(
    { format: '{bar} | {name} | {value}/{total}' },
    cliProgress.Presets.shades_classic,
  );
  bar.start(count, 0, { name: 'Providers Services Categories' });

  const pscFactory = factoryManager.get(ProviderServiceCategory);
  const providerServiceCategories: ProviderServiceCategory[] = [];
  for (let i = 0; i < count; i++) {
    const providerServiceCategory = await pscFactory.make({
      provider: providers[Math.floor(Math.random() * providers.length)],
      serviceCategory: serviceCategories[Math.floor(Math.random() * serviceCategories.length)],
    });
    providerServiceCategories.push(providerServiceCategory);
    bar.update(i + 1);
  }
  await dataSource.getRepository(ProviderServiceCategory).save(providerServiceCategories);
  bar.stop();
  return providerServiceCategories;
}
