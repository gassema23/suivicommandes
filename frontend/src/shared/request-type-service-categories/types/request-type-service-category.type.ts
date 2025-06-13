import type { RequestType } from "@/shared/request-types/types/request-type.type";
import type { ServiceCategory } from "@/shared/service-categories/types/service-category.type";
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
