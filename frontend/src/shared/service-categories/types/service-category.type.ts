import type { Service } from "@/shared/services/types/service.type";
import type { PaginatedResponse } from "@/types/paginate-response.type";

export type ServiceCategory = {
  id: string;
  serviceId?: string;
  serviceCategoryName: string;
  isMultiLink?: boolean;
  isMultiProvider?: boolean;
  isRequiredExpertise?: boolean;
  serviceCategoryDescription?: string;
  service: Service;
};

export type ServiceCategoryResponse = PaginatedResponse<ServiceCategory>;
