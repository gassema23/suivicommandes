import { DeliverableDelayFlow } from '../../deliverable-delay-flows/entities/deliverable-delay-flow.entity';
import { setSeederFactory } from 'typeorm-extension';

export const DeliverableDelayFlowFactory = setSeederFactory(
  DeliverableDelayFlow,
  (faker) => {
    const deliverableDelayFlow = new DeliverableDelayFlow();
    return deliverableDelayFlow;
  },
);
