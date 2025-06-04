export const ACTIONS = [
  "read",
  "create",
  "update",
  "delete",
  "export",
  "import",
] as const;
type Action = (typeof ACTIONS)[number];

const makePermissions = <T extends string>(resource: T) =>
  ACTIONS.reduce(
    (acc, action) => ({
      ...acc,
      [action.toUpperCase()]: { resource, action },
    }),
    {} as Record<Uppercase<Action>, { resource: T; action: Action }>
  );

export const PERMISSIONS = {
  TEAMS: makePermissions("teams"),
  USERS: makePermissions("users"),
  ROLES: makePermissions("roles"),
  HOLIDAYS: makePermissions("holidays"),
  SECTORS: makePermissions("sectors"),
  SERVICES: makePermissions("services"),
  SERVICE_CATEGORIES: makePermissions("service_categories"),
  CLIENTS: makePermissions("clients"),
  SUBDIVISION_CLIENTS: makePermissions("subdivision_clients"),
  PROVIDERS: makePermissions("providers"),
  PROVIDER_SERVICE_CATEGORIES: makePermissions("provider_service_categories"),
} as const;

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MANAGER: "manager",
  GUEST: "guest",
} as const;
