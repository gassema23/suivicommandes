import { Client } from '../../clients/entities/client.entity';
import { SeederFactoryManager } from 'typeorm-extension';
import * as cliProgress from 'cli-progress';
import { DataSource } from 'typeorm';

export async function clientSeed(
  dataSource: DataSource,
  factoryManager: SeederFactoryManager,
  count: number,
): Promise<Client[]> {
  const clientBar = new cliProgress.SingleBar(
    { format: '{bar} | {name} | {value}/{total}' },
    cliProgress.Presets.shades_classic,
  );
  clientBar.start(count, 0, { name: 'Clients' });
  const clientFactory = factoryManager.get(Client);
  const clients: Client[] = [];
  for (let i = 0; i < count; i++) {
    const client = await clientFactory.make();
    clients.push(client);
    clientBar.update(i + 1);
  }
  await dataSource.getRepository(Client).save(clients);
  clientBar.stop();
  return clients;
}
