export const QUERY_KEYS = {
  // Secteurs
  SECTORS: ["sectors"] as const,
  SECTORS_WITH_PAGE: (page: number) => ["sectors", page] as const,
  SECTORS_LISTS: ["sectorsLists"] as const,
  SECTOR_WITH_ID: (sectorId?: string | null) => ["sectors", sectorId] as const,

  // Services
  SERVICES: ["services"] as const,
  SERVICE_BY_SECTOR: (sectorId?: string | null) =>
    ["serviceBySector", sectorId] as const,
  SERVICE_WITH_ID: (serviceId?: string | null) =>
    ["services", serviceId] as const,
  SERVICES_WITH_PAGE: (page: number) => ["services", page] as const,

  // Service categories
  SERVICE_CATEGORIES: ["serviceCategories"] as const,
  SERVICE_CATEGORY_WITH_ID: (serviceCategoryId?: string | null) =>
    ["serviceCategories", serviceCategoryId] as const,
  SERVICE_CATEGORY_BY_SERVICE: (serviceId?: string | null) =>
    ["serviceCategoryByService", serviceId] as const,
  SERVICE_CATEGORIES_WITH_PAGE: (page: number) =>
    ["serviceCategories", page] as const,

  // Fournisseurs
  PROVIDERS: ["providers"] as const,
  PROVIDER_WITH_ID: (providerId?: string | null) =>
    ["providers", providerId] as const,
  PROVIDERS_LISTS: ["providersLists"] as const,
  PROVIDERS_WITH_PAGE: (page: number) => ["providers", page] as const,

  // Fournisseurs par service
  PROVIDER_SERVICE_CATEGORIES: ["providerServiceCategories"] as const,
  PROVIDER_SERVICE_CATEGORY_WITH_ID: (
    providerServiceCategoryId?: string | null
  ) => ["providerServiceCategories", providerServiceCategoryId] as const,
  PROVIDER_SERVICE_CATEGORY_BY_PROVIDER: (providerId?: string | null) =>
    ["providerServiceCategoryByProvider", providerId] as const,
  PROVIDER_SERVICE_CATEGORIES_WITH_PAGE: (page: number) =>
    ["providerServiceCategories", page] as const,

  // Clients
  CLIENTS: ["clients"] as const,
  CLIENTS_LISTS: ["clientsLists"] as const,
  CLIENTS_WITH_ID: (clientId?: string | null) => ["clients", clientId] as const,
  CLIENTS_WITH_PAGE: (page: number) => ["clients", page] as const,

  // Subdivisions clients
  SUBDIVISION_CLIENTS: ["subdivisionClients"] as const,
  SUBDIVISION_CLIENT_WITH_ID: (subdivisionClientId?: string | null) =>
    ["subdivisionClients", subdivisionClientId] as const,
  SUBDIVISION_CLIENTS_WITH_PAGE: (page: number) =>
    ["subdivisionClients", page] as const,

  // Équipes
  TEAMS: ["teams"] as const,
  TEAMS_LISTS: ["teamsLists"] as const,
  TEAM_WITH_ID: (teamId?: string | null) => ["teams", teamId] as const,

  // Utilisateurs
  USERS: ["users"] as const,
  USERS_LISTS: ["usersLists"] as const,
  USERS_WITH_PAGE: (page: number) => ["usersWithPage", page] as const,
  ME: ["me"] as const,
  PROFILE: ["profile"] as const,

  // Rôles et ressources
  ROLES: ["roles"] as const,
  ROLES_LISTS: ["rolesLists"] as const,
  ROLE_WITH_ID: (roleId?: string | null) => ["roles", roleId] as const,
  RESOURCE: ["resources"] as const,

  // Congés et jours fériés
  HOLIDAYS: ["holidays"] as const,
  HOLIDAY_WITH_ID: (holidayId?: string | null) =>
    ["holidays", holidayId] as const,
};
