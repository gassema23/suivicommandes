import { Provider } from '../../providers/entities/provider.entity';
import { SeederFactoryManager } from 'typeorm-extension';
import * as cliProgress from 'cli-progress';
import { DataSource } from 'typeorm';

export async function providerSeed(
  dataSource: DataSource,
  factoryManager: SeederFactoryManager,
  count: number,
): Promise<Provider[]> {
  const providerBar = new cliProgress.SingleBar(
    { format: '{bar} | {name} | {value}/{total}' },
    cliProgress.Presets.shades_classic,
  );
  providerBar.start(count, 0, { name: 'Providers' });

  const providerFactory = factoryManager.get(Provider);
  const providers: Provider[] = [];
  for (let i = 0; i < count; i++) {
    const provider = await providerFactory.make();
    providers.push(provider);
    providerBar.update(i + 1);
  }
  await dataSource.getRepository(Provider).save(providers);
  providerBar.stop();
  return providers;
}
