import type { DeliverableDelayRequestType } from "@/shared/deliverable-delay-request-types/types/deliverable-delay-request-type.type";
import type { Flow } from "@/shared/flow/types/flow.type";
import type { PaginatedResponse } from "@/types/paginate-response.type";

export type DeliverableDelayFlow = {
  id: string;
  flowId: string;
  deliverableDelayRequestTypeId: string;
  flow: Flow;
  deliverableDelayRequestType: DeliverableDelayRequestType;
};

export type DeliverableDelayFlowResponse =
  PaginatedResponse<DeliverableDelayFlow>;
