import { DeliverableDelayRequestType } from '../../deliverable-delay-request-types/entities/deliverable-delay-request-type.entity';
import { setSeederFactory } from 'typeorm-extension';

export const DeliverableDelayRequestTypeFactory = setSeederFactory(
  DeliverableDelayRequestType,
  (faker) => {
    const deliverableDelayRequestType = new DeliverableDelayRequestType();
    return deliverableDelayRequestType;
  },
);
