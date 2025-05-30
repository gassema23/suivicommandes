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
} as const;

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MANAGER: "manager",
  GUEST: "guest",
} as const;
