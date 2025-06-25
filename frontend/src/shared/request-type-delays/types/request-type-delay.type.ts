import type { DelayType } from "@/shared/delay-types/types/delay-type.type";
import type { RequestTypeServiceCategory } from "@/shared/request-type-service-categories/types/request-type-service-category.type";
import type { PaginatedResponse } from "@/types/paginate-response.type";

export type RequestTypeDelay = {
  id: string;
  requestTypeServiceCategoryId: string;
  delayTypeId: string;
  delayValue?: number;
  requestTypeServiceCategory: RequestTypeServiceCategory;
  delayType: DelayType;
};

export type RequestTypeDelayResponse = PaginatedResponse<RequestTypeDelay>;
