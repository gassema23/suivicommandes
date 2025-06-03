import type { Sector } from "@/features/sectors/types/sector.type";

export interface Service {
  id: string;
  sectorId?: string;
  serviceName: string;
  serviceDescription?: string;
  sector: Sector;
}
