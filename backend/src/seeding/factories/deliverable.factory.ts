import { Deliverable } from '../../deliverables/entities/deliverable.entity';
import { setSeederFactory } from 'typeorm-extension';

export const DeliverableFactory = setSeederFactory(Deliverable, (faker) => {
  const deliverable = new Deliverable();
  deliverable.deliverableName = faker.animal.insect();
  return deliverable;
});
