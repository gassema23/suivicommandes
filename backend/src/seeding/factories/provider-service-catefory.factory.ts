import { ProviderServiceCategory } from '../../provider-service-categories/entities/provider-service-category.entity';
import { setSeederFactory } from 'typeorm-extension';

export const ProviderServiceCategoryFactory = setSeederFactory(ProviderServiceCategory, (faker) => {
  const providerServiceCategory = new ProviderServiceCategory();

  return providerServiceCategory;
});
