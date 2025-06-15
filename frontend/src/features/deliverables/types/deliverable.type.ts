import type { PaginatedResponse } from "@/types/paginate-response.type";

export type Deliverable = {
  id: string;
  deliverableName: string;
  deliverableDescription?: string;
};

export type DeliverableResponse = PaginatedResponse<Deliverable>;
