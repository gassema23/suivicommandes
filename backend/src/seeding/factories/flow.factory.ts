import { Flow } from '../../flows/entities/flow.entity';
import { setSeederFactory } from 'typeorm-extension';

export const FlowFactory = setSeederFactory(Flow, (faker) => {
  const flow = new Flow();
  flow.flowName = faker.animal.dog();
  return flow;
});
