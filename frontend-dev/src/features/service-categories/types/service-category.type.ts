import type { Service } from "@/features/services/types/service.type";

export interface ServiceCategory {
  id: string;
  serviceId?: string;
  serviceCategoryName: string;
  isMultiLink?: boolean;
  isMultiProvider?: boolean;
  isRequiredExpertise?: boolean;
  serviceCategoryDescription?: string;
  service: Service;
}
