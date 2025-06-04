import type { Provider } from "@/features/providers/types/provider.type";
import type { ServiceCategory } from "@/features/service-categories/types/service-category.type";
import type { PaginatedResponse } from "@/types/paginate-response.type";

export type ProviderServiceCategory = {
  id: string;
  providerId: string;
  serviceCategoryId: string;
  serviceCategory: ServiceCategory;
  provider: Provider;
};

export type ProviderServiceCategoryResponse = PaginatedResponse<ProviderServiceCategory>;