import type { PaginatedResponse } from "@/types/paginate-response.type";

export type RequestType = {
  id: string;
  requestTypeName: string;
  requestTypeDescription?: string;
};

export type RequestTypeResponse = PaginatedResponse<RequestType>;
