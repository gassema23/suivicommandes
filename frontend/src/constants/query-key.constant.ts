export const QUERY_KEYS = {
  // Secteurs
  SECTORS: ["sectors"] as const,
  SECTORS_WITH_PAGE: (page: number) => ["sectors", page] as const,
  SECTORS_LISTS: ["sectorsLists"] as const,
  SECTOR_WITH_ID: (sectorId?: string | null) =>
    ["sectors", sectorId ?? ""] as const,

  // Services
  SERVICES: ["services"] as const,
  SERVICE_BY_SECTOR: (sectorId?: string | null) =>
    ["serviceBySector", sectorId ?? ""] as const,
  SERVICE_WITH_ID: (serviceId?: string | null) =>
    ["services", serviceId ?? ""] as const,
  SERVICES_WITH_PAGE: (page: number) => ["services", page] as const,

  // Service categories
  SERVICE_CATEGORIES: ["serviceCategories"] as const,
  SERVICE_CATEGORY_WITH_ID: (serviceCategoryId?: string | null) =>
    ["serviceCategories", serviceCategoryId ?? ""] as const,
  SERVICE_CATEGORY_BY_SERVICE: (serviceId?: string | null) =>
    ["serviceCategoryByService", serviceId ?? ""] as const,
  SERVICE_CATEGORIES_WITH_PAGE: (page: number) =>
    ["serviceCategories", page] as const,

  // Fournisseurs
  PROVIDERS: ["providers"] as const,
  PROVIDER_WITH_ID: (providerId?: string | null) =>
    ["providers", providerId ?? ""] as const,
  PROVIDERS_LISTS: ["providersLists"] as const,
  PROVIDERS_WITH_PAGE: (page: number) => ["providers", page] as const,

  // Fournisseurs par service
  PROVIDER_SERVICE_CATEGORIES: ["providerServiceCategories"] as const,
  PROVIDER_SERVICE_CATEGORY_WITH_ID: (
    providerServiceCategoryId?: string | null
  ) => ["providerServiceCategories", providerServiceCategoryId ?? ""] as const,
  PROVIDER_SERVICE_CATEGORY_BY_PROVIDER: (providerId?: string | null) =>
    ["providerServiceCategoryByProvider", providerId ?? ""] as const,
  PROVIDER_SERVICE_CATEGORIES_WITH_PAGE: (page: number) =>
    ["providerServiceCategories", page] as const,

  // Disponibilité des Fournisseurs
  PROVIDER_DISPONIBILITIES: ["providerDisponibilities"] as const,
  PROVIDER_DISPONIBILITY_WITH_ID: (providerId?: string | null) =>
    ["providerDisponibilities", providerId ?? ""] as const,
  PROVIDER_DISPONIBILITIES_LISTS: ["providerDisponibilitiesLists"] as const,
  PROVIDER_DISPONIBILITIES_WITH_PAGE: (page: number) =>
    ["providerDisponibilities", page] as const,

  // Clients
  CLIENTS: ["clients"] as const,
  CLIENTS_LISTS: ["clientsLists"] as const,
  CLIENTS_WITH_ID: (clientId?: string | null) =>
    ["clients", clientId ?? ""] as const,
  CLIENTS_WITH_PAGE: (page: number) => ["clients", page] as const,

  // Subdivisions clients
  SUBDIVISION_CLIENTS: ["subdivisionClients"] as const,
  SUBDIVISION_CLIENT_WITH_ID: (subdivisionClientId?: string | null) =>
    ["subdivisionClients", subdivisionClientId ?? ""] as const,
  SUBDIVISION_CLIENTS_WITH_PAGE: (page: number) =>
    ["subdivisionClients", page] as const,

  // Équipes
  TEAMS: ["teams"] as const,
  TEAMS_LISTS: ["teamsLists"] as const,
  TEAM_WITH_ID: (teamId?: string | null) => ["teams", teamId ?? ""] as const,
  TEAMS_WITH_PAGE: (page: number) => ["teams", page] as const,

  // Utilisateurs
  USERS: ["users"] as const,
  USERS_LISTS: ["usersLists"] as const,
  USERS_WITH_PAGE: (page: number) => ["usersWithPage", page] as const,
  ME: ["me"] as const,
  PROFILE: ["profile"] as const,
  OWNER_LISTS: ["ownerLists"] as const,
  UPDATE_USER_INFORMATION: (userId: string) => ["profile", userId] as const,

  // Rôles et ressources
  ROLES: ["roles"] as const,
  ROLES_LISTS: ["rolesLists"] as const,
  ROLE_WITH_ID: (roleId?: string | null) => ["roles", roleId ?? ""] as const,
  RESOURCE: ["resources"] as const,

  // Congés et jours fériés
  HOLIDAYS: ["holidays"] as const,
  HOLIDAY_WITH_ID: (holidayId?: string | null) =>
    ["holidays", holidayId ?? ""] as const,
  HOLIDAYS_WITH_PAGE: (page: number) => ["holidays", page] as const,

  // Type de délai
  DELAY_TYPES: ["delayTypes"] as const,
  DELAY_TYPE_WITH_ID: (delayTypeId?: string | null) =>
    ["delayTypes", delayTypeId ?? ""] as const,
  DELAY_TYPES_WITH_PAGE: (page: number) => ["delayTypes", page] as const,

  // Type de réquisition
  REQUISITION_TYPES: ["requisitionTypes"] as const,
  REQUISITION_TYPE_WITH_ID: (requisitionTypeId?: string | null) =>
    ["requisitionTypes", requisitionTypeId ?? ""] as const,
  REQUISITION_TYPES_WITH_PAGE: (page: number) =>
    ["requisitionTypes", page] as const,

  // Type de demande
  REQUEST_TYPES: ["requestTypes"] as const,
  REQUEST_TYPE_WITH_ID: (requestTypeId?: string | null) =>
    ["requestTypes", requestTypeId ?? ""] as const,
  REQUEST_TYPES_WITH_PAGE: (page: number) => ["requestTypes", page] as const,
  REQUEST_TYPES_LISTS: ["requestTypesLists"] as const,
  REQUEST_TYPES_BY_SERVICE_CATEGORY: (serviceCategoryId?: string | null) =>
    ["requestTypesByServiceCategory", serviceCategoryId ?? ""] as const,

  // Type de conformité
  CONFORMITY_TYPES: ["conformityTypes"] as const,
  CONFORMITY_TYPE_WITH_ID: (conformityTypeId?: string | null) =>
    ["conformityTypes", conformityTypeId ?? ""] as const,
  CONFORMITY_TYPES_WITH_PAGE: (page: number) =>
    ["conformityTypes", page] as const,

  // Livrables
  DELIVERABLES: ["deliverables"] as const,
  DELIVERABLE_WITH_ID: (deliverableId?: string | null) =>
    ["deliverables", deliverableId ?? ""] as const,
  DELIVERABLES_WITH_PAGE: (page: number) => ["deliverables", page] as const,
  DELIVERABLES_LISTS: ["deliverablesLists"] as const,

  // Flux de transmission
  FLOWS: ["flow"] as const,
  FLOW_WITH_ID: (flowId?: string | null) => ["flow", flowId ?? ""] as const,
  FLOWS_WITH_PAGE: (page: number) => ["flow", page] as const,

  // Request Type Service Categories
  REQUEST_TYPE_SERVICE_CATEGORIES_WITH_PAGE: (page: number) =>
    ["requestTypeServiceCategories", page] as const,
  REQUEST_TYPE_SERVICE_CATEGORIES: ["requestTypeServiceCategories"] as const,
  REQUEST_TYPE_SERVICE_CATEGORY_WITH_ID: (
    requestTypeServiceCategoryId?: string | null
  ) =>
    [
      "requestTypeServiceCategories",
      requestTypeServiceCategoryId ?? "",
    ] as const,
  REQUEST_TYPE_SERVICE_CATEGORY_BY_SERVICE_CATEGORY: (
    serviceCategoryId?: string | null
  ) =>
    [
      "requestTypeServiceCategoryByServiceCategory",
      serviceCategoryId ?? "",
    ] as const,

  // Request type delays
  REQUEST_TYPE_DELAY_WITH_PAGE: (page: number) =>
    ["requestTypeDelays", page] as const,
  REQUEST_TYPE_DELAYS: ["requestTypeDelays"] as const,
  REQUEST_TYPE_DELAY_WITH_ID: (requestTypeDelayId?: string | null) =>
    ["requestTypeDelays", requestTypeDelayId ?? ""] as const,

  DELIVERABLE_DELAY_RQUEST_TYPES_WITH_PAGE: (page: number) =>
    ["deliverableDelayRequestTypes", page] as const,
  DELIVERABLE_DELAY_RQUEST_TYPES: ["deliverableDelayRequestTypes"] as const,
  DELIVERABLE_DELAY_REQUEST_TYPE_WITH_ID: (
    deliverableDelayRequestTypeId?: string | null
  ) => {
    return [
      "deliverableDelayRequestTypes",
      deliverableDelayRequestTypeId ?? "",
    ] as const;
  },
};
