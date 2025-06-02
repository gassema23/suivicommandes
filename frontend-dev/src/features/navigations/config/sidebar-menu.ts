import { PERMISSIONS } from "@/features/authorizations/types/auth.types";

export const sidebarMenu = {
  navMain: [
    {
      title: "Application",
      url: "#",
      items: [
        {
          title: "Suivi des commandes",
          url: "/applications/tracking",
          isActive: true,
        },
        {
          title: "Mes commandes",
          url: "/applications/mine",
        },
      ],
    },
    {
      title: "Pilotage",
      url: "#",
      requiredPermissions: [
        PERMISSIONS.USERS.READ,
        PERMISSIONS.TEAMS.READ,
        PERMISSIONS.ROLES.READ,
      ],
      permissionLogic: "OR",
      items: [
        {
          title: "Utilisateurs",
          url: "/pilotages/users",
          permission: PERMISSIONS.USERS.READ,
        },
        {
          title: "Équipes",
          url: "/pilotages/teams",
          permission: PERMISSIONS.TEAMS.READ,
        },
        {
          title: "Jours fériés",
          url: "/pilotages/holidays",
          permission: PERMISSIONS.HOLIDAYS.READ,
        },
      ],
    },
    {
      title: "Administration",
      url: "#",
      hasRole: "admin",
      items: [
        {
          title: "Rôles",
          url: "/administrations/roles",
          permission: PERMISSIONS.ROLES.READ,
        },
        {
          title: "Gestion avancée",
          url: "/administrations/advanced",
          permission: PERMISSIONS.USERS.READ,
        },
        {
          title: "Configuration système",
          url: "/administrations/system",
          role: "admin",
        },
      ],
    },
  ],
};
