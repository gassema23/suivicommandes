import { SeederFactoryManager } from 'typeorm-extension';
import * as cliProgress from 'cli-progress';
import { DataSource } from 'typeorm';
import { Client } from '../../clients/entities/client.entity';
import { SubdivisionClient } from '../../subdivision-clients/entities/subdivision-client.entity';

export async function subdivisionClientSeed(
  dataSource: DataSource,
  factoryManager: SeederFactoryManager,
  count: number,
  clients: Client[],
): Promise<SubdivisionClient[]> {
  const subdivisionClientBar = new cliProgress.SingleBar(
    { format: '{bar} | {name} | {value}/{total}' },
    cliProgress.Presets.shades_classic,
  );
  subdivisionClientBar.start(count, 0, { name: 'Subdivision clients' });

  const subdivisionClientFactory = factoryManager.get(SubdivisionClient);
  const subdivisionClients: SubdivisionClient[] = [];
  for (let i = 0; i < count; i++) {
    const subdivisionClient = await subdivisionClientFactory.make({
      client: clients[Math.floor(Math.random() * clients.length)],
    });
    subdivisionClients.push(subdivisionClient);
    subdivisionClientBar.update(i + 1);
  }
  await dataSource.getRepository(SubdivisionClient).save(subdivisionClients);
  subdivisionClientBar.stop();
  return subdivisionClients;
}
