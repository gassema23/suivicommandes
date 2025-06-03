export interface Sector {
  id: string;
  sectorName: string;
  sectorDescription?: string;
  sectorClientTimeEnd?: string;
  sectorProviderTimeEnd?: string;
  isAutoCalculate?: boolean;
  isConformity?: boolean;
}
