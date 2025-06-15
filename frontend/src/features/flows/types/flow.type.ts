import type { PaginatedResponse } from "@/types/paginate-response.type";

export type Flow = {
  id: string;
  flowName: string;
  flowDescription?: string;
};

export type FlowResponse = PaginatedResponse<Flow>;
