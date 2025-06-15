import { ServiceCategory } from '../../service-categories/entities/service-category.entity';
import { setSeederFactory } from 'typeorm-extension';

export const ServiceCategoryFactory = setSeederFactory(
  ServiceCategory,
  (faker) => {
    const serviceCategory = new ServiceCategory();
    serviceCategory.serviceCategoryName = faker.company.name();
    serviceCategory.isMultiLink = faker.datatype.boolean();
    serviceCategory.isMultiProvider = faker.datatype.boolean();
    serviceCategory.isRequiredExpertise = faker.datatype.boolean();
    return serviceCategory;
  },
);
