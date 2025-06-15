import { SeederFactoryManager } from 'typeorm-extension';
import * as cliProgress from 'cli-progress';
import { DataSource } from 'typeorm';
import { Holiday } from '../../holidays/entities/holiday.entity';

export async function holidaySeed(
  dataSource: DataSource,
  factoryManager: SeederFactoryManager,
  count: number,
): Promise<Holiday[]> {
  const holidayBar = new cliProgress.SingleBar(
    { format: '{bar} | {name} | {value}/{total}' },
    cliProgress.Presets.shades_classic,
  );
  holidayBar.start(count, 0, { name: 'Holiday' });
1
  const holidayFactory = factoryManager.get(Holiday);
  const holidays: Holiday[] = [];
  for (let i = 0; i < count; i++) {
    const holiday = await holidayFactory.make();
    holidays.push(holiday);
    holidayBar.update(i + 1);
  }
  await dataSource.getRepository(Holiday).save(holidays);
  holidayBar.stop();
  return holidays;
}
