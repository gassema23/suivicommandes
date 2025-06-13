import type { Provider } from "@/shared/providers/types/provider.type";
import type { ServiceCategory } from "@/shared/service-categories/types/service-category.type";
import type { PaginatedResponse } from "@/types/paginate-response.type";

export type ProviderServiceCategory = {
  id: string;
  providerId: string;
  serviceCategoryId: string;
  serviceCategory: ServiceCategory;
  provider: Provider;
};

export type ProviderServiceCategoryResponse = PaginatedResponse<ProviderServiceCategory>;