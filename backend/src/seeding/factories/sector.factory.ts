import { Sector } from '../../sectors/entities/sectors.entity';
import { setSeederFactory } from 'typeorm-extension';

export const SectorFactory = setSeederFactory(Sector, (faker) => {
  const sector = new Sector();
  
  sector.sectorName = faker.company.name();
  sector.sectorClientTimeEnd = faker.date
    .soon()
    .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  sector.sectorProviderTimeEnd = faker.date
    .soon()
    .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  sector.isAutoCalculate = faker.datatype.boolean();
  sector.isConformity = faker.datatype.boolean();
  return sector;
});