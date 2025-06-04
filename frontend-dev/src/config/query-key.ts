export const QUERY_KEYS = {
  // Secteurs
  SECTORS: ["sectors"] as const,
  SECTORS_LISTS: ["sectorsLists"] as const,
  SECTOR_WITH_ID: (sectorId?: string | null) => ["sectorWithId", sectorId] as const,

  // Services
  SERVICES: ["services"] as const,
  SERVICE_BY_SECTOR: (sectorId?: string | null) => ["serviceBySector", sectorId] as const,
  SERVICE_WITH_ID: (serviceId?: string | null) => ["serviceWithId", serviceId] as const,
  SERVICE_CATEGORIES: ["serviceCategories"] as const,
  SERVICE_CATEGORY_WITH_ID: (serviceCategoryId?: string | null) =>
    ["serviceCategoryWithId", serviceCategoryId] as const,

  // Fournisseurs
  PROVIDERS: ["providers"] as const,
  PROVIDER_WITH_ID: (providerId?: string | null) => ["providerWithId", providerId] as const,
  PROVIDER_SERVICE_CATEGORIES: ["providerServiceCategories"] as const,

  // Clients
  CLIENTS: ["clients"] as const,
  CLIENTS_LISTS: ["clientsLists"] as const,
  CLIENTS_WITH_ID: (clientId?: string | null) => ["clientsWithId", clientId] as const,
  SUBDIVISION_CLIENTS: ["subdivisionClients"] as const,
  SUBDIVISION_CLIENT_WITH_ID: (subdivisionClientId?: string | null) =>
    ["subdivisionClientWithId", subdivisionClientId] as const,

  // Équipes
  TEAMS: ["teams"] as const,
  TEAMS_LISTS: ["teamsLists"] as const,
  TEAM_WITH_ID: (teamId?: string | null) => ["teamWithId", teamId] as const,

  // Utilisateurs
  USERS: ["users"] as const,
  USERS_LISTS: ["usersLists"] as const,
  USERS_WITH_PAGE: (page: number) => ["usersWithPage", page] as const,
  ME: ["me"] as const,
  PROFILE: ["profile"] as const,

  // Rôles et ressources
  ROLES: ["roles"] as const,
  ROLES_LISTS: ["rolesLists"] as const,
  ROLE_WITH_ID: (roleId?: string | null) => ["roleWithId", roleId] as const,
  RESOURCE: ["resources"] as const,

  // Congés et jours fériés
  HOLIDAYS: ["holidays"] as const,
  HOLIDAY_WITH_ID: (holidayId?: string | null) => ["holidayWithId", holidayId] as const,
};