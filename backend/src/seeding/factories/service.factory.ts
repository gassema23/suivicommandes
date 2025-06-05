import { Service } from '../../services/entities/service.entity';
import { setSeederFactory } from 'typeorm-extension';

export const ServiceFactory = setSeederFactory(Service, (faker) => {
  const service = new Service();
  service.serviceName = faker.company.name();
  return service;
});