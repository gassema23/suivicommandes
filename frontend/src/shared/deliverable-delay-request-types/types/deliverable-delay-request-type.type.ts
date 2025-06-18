import type { Deliverable } from "@/shared/deliverable/types/deliverable.type";
import type { RequestTypeServiceCategory } from "@/shared/request-type-service-categories/types/request-type-service-category.type";
import type { PaginatedResponse } from "@/types/paginate-response.type";

export type DeliverableDelayRequestType = {
  id: string;
  deliverableId: string;
  requestTypeServiceCategoryId: string;
  deliverable: Deliverable;
  requestTypeServiceCategory: RequestTypeServiceCategory;
};

export type DeliverableDelayRequestTypeResponse =
  PaginatedResponse<DeliverableDelayRequestType>;
