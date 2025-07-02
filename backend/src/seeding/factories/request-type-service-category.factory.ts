import { RequestTypeServiceCategory } from '../../request-type-service-categories/entities/request-type-service-category.entity';
import { setSeederFactory } from 'typeorm-extension';

export const RequestTypeServiceCategoryFactory = setSeederFactory(
  RequestTypeServiceCategory,
  (faker) => {
    const requestTypeServiceCategory = new RequestTypeServiceCategory();
    requestTypeServiceCategory.availabilityDelay = faker.number.int({
      min: 0,
      max: 90,
    });
    requestTypeServiceCategory.minimumRequiredDelay = faker.number.int({
      min: 0,
      max: 90,
    });
    requestTypeServiceCategory.serviceActivationDelay = faker.number.int({
      min: 0,
      max: 90,
    });
    return requestTypeServiceCategory;
  },
);
