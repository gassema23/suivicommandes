import { Service } from '../../services/entities/service.entity';
import { SeederFactoryManager } from 'typeorm-extension';
import * as cliProgress from 'cli-progress';
import { DataSource } from 'typeorm';
import { Sector } from '../../sectors/entities/sectors.entity';

export async function serviceSeed(
  dataSource: DataSource,
  factoryManager: SeederFactoryManager,
  count: number,
  sectors: Sector[]
): Promise<Service[]> {
  const serviceBar = new cliProgress.SingleBar(
    { format: '{bar} | {name} | {value}/{total}' },
    cliProgress.Presets.shades_classic,
  );
  serviceBar.start(count, 0, { name: 'Services' });

  const serviceFactory = factoryManager.get(Service);
  const services: Service[] = [];
  for (let i = 0; i < count; i++) {
    const service = await serviceFactory.make({
      sector: sectors[Math.floor(Math.random() * sectors.length)],
    });
    services.push(service);
    serviceBar.update(i + 1);
  }
  await dataSource.getRepository(Service).save(services);
  serviceBar.stop();
  return services;
}