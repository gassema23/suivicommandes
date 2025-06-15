import { Sector } from '../../sectors/entities/sectors.entity';
import { SeederFactoryManager } from 'typeorm-extension';
import * as cliProgress from 'cli-progress';
import { DataSource } from 'typeorm';

export async function sectorSeed(
  dataSource: DataSource,
  factoryManager: SeederFactoryManager,
  count: number,
): Promise<Sector[]> {
  const sectorBar = new cliProgress.SingleBar(
    { format: '{bar} | {name} | {value}/{total}' },
    cliProgress.Presets.shades_classic,
  );
  sectorBar.start(count, 0, { name: 'Sectors' });

  const sectorFactory = factoryManager.get(Sector);
  const sectors: Sector[] = [];
  for (let i = 0; i < count; i++) {
    const sector = await sectorFactory.make();
    sectors.push(sector);
    sectorBar.update(i + 1);
  }
  await dataSource.getRepository(Sector).save(sectors);
  sectorBar.stop();
  return sectors;
}
