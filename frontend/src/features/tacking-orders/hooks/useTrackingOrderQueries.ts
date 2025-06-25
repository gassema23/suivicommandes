import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { useDependentQuery } from "@/components/dependant-select/hooks/useDependentQuery";

import { getRequisitionTypeList } from "@/shared/requisition-types/services/get-requisition-type-list.service";
import { fetchClients } from "@/shared/clients/services/fetch-client.service";
import { getSubdivisionClientByClientId } from "@/shared/subdivision-clients/services/get-subdivision-client-by-client-id.service";
import { fetchSectorsList } from "@/shared/sectors/services/fetch-sectors-list.service";
import { fetchServicesBySector } from "@/shared/services/services/fetch-services-by-sector.service";
import { fetchServiceCategoriesByService } from "@/shared/service-categories/services/fetch-service-category-by-service.service";
import { getRequestTypeServiceCategoryByServiceCategory } from "@/shared/request-type-service-categories/services/get-request-type-service-category-by-service-category.service";
import { getRequestTypeDelaysByRequestType } from "@/shared/request-type-delays/services/get-request-type-delays-by-request-type.service";

interface UseTrackingOrderQueriesProps {
  clientId: string;
  sectorId: string;
  serviceId: string;
  serviceCategoryId: string;
  requestTypeServiceCategoryId: string;
}

export function useTrackingOrderQueries({
  clientId,
  sectorId,
  serviceId,
  serviceCategoryId,
  requestTypeServiceCategoryId,
}: UseTrackingOrderQueriesProps) {
  // Queries indépendantes
  const requisitionTypesQuery = useQuery({
    queryKey: QUERY_KEYS.REQUISITION_TYPES,
    queryFn: getRequisitionTypeList,
  });

  const clientsQuery = useQuery({
    queryKey: QUERY_KEYS.CLIENTS_LISTS,
    queryFn: fetchClients,
  });

  const sectorsQuery = useQuery({
    queryKey: QUERY_KEYS.SECTORS_LISTS,
    queryFn: fetchSectorsList,
  });

  // Queries dépendantes
  const subdivisionClientsQuery = useDependentQuery(
    QUERY_KEYS.SUBDIVISION_CLIENT_BY_CLIENT_ID(clientId),
    getSubdivisionClientByClientId,
    clientId
  );

  const servicesQuery = useDependentQuery(
    QUERY_KEYS.SERVICE_BY_SECTOR(sectorId),
    fetchServicesBySector,
    sectorId
  );

  const serviceCategoriesQuery = useDependentQuery(
    QUERY_KEYS.SERVICE_CATEGORY_BY_SERVICE(serviceId),
    fetchServiceCategoriesByService,
    serviceId
  );

  const requestTypeServiceCategoriesQuery = useDependentQuery(
    QUERY_KEYS.REQUEST_TYPES_BY_SERVICE_CATEGORY(serviceCategoryId),
    getRequestTypeServiceCategoryByServiceCategory,
    serviceCategoryId
  );

  const requestTypeDelaysQuery = useDependentQuery(
    QUERY_KEYS.REQUEST_TYPE_DELAYS_BY_REQUEST_TYPE(requestTypeServiceCategoryId),
    getRequestTypeDelaysByRequestType,
    requestTypeServiceCategoryId
  );

  return {
    requisitionTypes: requisitionTypesQuery,
    clients: clientsQuery,
    sectors: sectorsQuery,
    subdivisionClients: subdivisionClientsQuery,
    services: servicesQuery,
    serviceCategories: serviceCategoriesQuery,
    requestTypeServiceCategories: requestTypeServiceCategoriesQuery,
    requestTypeDelays: requestTypeDelaysQuery,
  };
}
