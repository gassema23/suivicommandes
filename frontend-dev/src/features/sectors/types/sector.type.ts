import type { PaginatedResponse } from "@/types/paginate-response.type";

export type Sector = {
  id: string;
  sectorName: string;
  sectorDescription?: string;
  sectorClientTimeEnd?: string;
  sectorProviderTimeEnd?: string;
  isAutoCalculate?: boolean;
  isConformity?: boolean;
}

export type SectorsResponse = PaginatedResponse<Sector>;
