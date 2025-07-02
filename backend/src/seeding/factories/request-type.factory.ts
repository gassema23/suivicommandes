import { RequestType } from '../../request-types/entities/request-type.entity';
import { setSeederFactory } from 'typeorm-extension';

export const RequestTypeFactory = setSeederFactory(RequestType, (faker) => {
  const requestType = new RequestType();

  requestType.requestTypeName = faker.commerce.productName();
  requestType.requestTypeDescription = faker.commerce.productDescription();
  return requestType;
});
