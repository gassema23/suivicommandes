import type { Sector } from "@/shared/sectors/types/sector.type";
import type { PaginatedResponse } from "@/types/paginate-response.type";

export type Service = {
  id: string;
  sectorId?: string;
  serviceName: string;
  serviceDescription?: string;
  sector: Sector;
};

export type ServiceResponse = PaginatedResponse<Service>;
