import type { RequestType } from "@/features/request-types/types/request-type.type";
import type { ServiceCategory } from "@/features/service-categories/types/service-category.type";
import type { PaginatedResponse } from "@/types/paginate-response.type";

export type RequestTypeServiceCategory = {
  id: string;
  requestTypeId: string;
  serviceCategoryId: string;
  availabilityDelay?: number;
  minimumRequiredDelay?: number;
  serviceActivationDelay?: number;
  serviceCategory:ServiceCategory;
  requestType:RequestType;
};

export type RequestTypeServiceCategoryResponse = PaginatedResponse<RequestTypeServiceCategory>;
