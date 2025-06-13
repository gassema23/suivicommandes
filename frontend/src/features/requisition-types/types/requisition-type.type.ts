import type { PaginatedResponse } from "@/types/paginate-response.type";

export type RequisitionType = {
  id: string;
  requisitionTypeName: string;
  requisitionTypeDescription?: string;
};

export type RequisitionTypeResponse = PaginatedResponse<RequisitionType>;
