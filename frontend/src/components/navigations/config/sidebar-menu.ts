import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";

export const sidebarMenu = {
  navMain: [
    {
      title: "Application",
      url: "#",
      items: [
        {
          title: "Tableau de bord",
          url: "/",
        },
        {
          title: "Suivi des commandes",
          url: "/applications/tracking-order",
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
        PERMISSIONS.HOLIDAYS.READ,
        PERMISSIONS.SECTORS.READ,
        PERMISSIONS.SERVICES.READ,
        PERMISSIONS.SERVICE_CATEGORIES.READ,
        PERMISSIONS.PROVIDERS.READ,
        PERMISSIONS.PROVIDER_SERVICE_CATEGORIES.READ,
        PERMISSIONS.CLIENTS.READ,
        PERMISSIONS.SUBDIVISION_CLIENTS.READ,
        PERMISSIONS.DELAY_TYPES.READ,
        PERMISSIONS.REQUISITION_TYPES.READ,
        PERMISSIONS.REQUEST_TYPES.READ,
        PERMISSIONS.CONFORMITY_TYPES.READ,
        PERMISSIONS.DELIVERABLES.READ,
        PERMISSIONS.FLOWS.READ,
        PERMISSIONS.PROVIDER_DISPONIBILITIES.READ,
        PERMISSIONS.REQUEST_TYPE_SERVICE_CATEGORIES.READ,
        PERMISSIONS.REQUEST_TYPE_DELAYS.READ,
        PERMISSIONS.DELIVERABLE_DELAY_REQUEST_TYPES.READ,
        PERMISSIONS.DELIVERABLE_DELAY_FLOWS.READ,
      ],
      permissionLogic: "OR",
      items: [
        {
          title: "Secteurs",
          url: "/pilotages/sectors",
          permission: PERMISSIONS.SECTORS.READ,
        },
        {
          title: "Services",
          url: "/pilotages/services",
          permission: PERMISSIONS.SERVICES.READ,
        },
        {
          title: "Catégories de services",
          url: "/pilotages/service-categories",
          permission: PERMISSIONS.SERVICE_CATEGORIES.READ,
        },
        {
          title: "Catégories de services par type de demande",
          url: "/pilotages/request-type-service-categories",
          permission: PERMISSIONS.REQUEST_TYPE_SERVICE_CATEGORIES.READ,
        },
        {
          title: "Délai par type de demande",
          url: "/pilotages/request-type-delays",
          permission: PERMISSIONS.REQUEST_TYPE_DELAYS.READ,
        },
        {
          title: "Type de demandes de délai de livraison",
          url: "/pilotages/deliverable-delay-request-types",
          permission: PERMISSIONS.DELIVERABLE_DELAY_REQUEST_TYPES.READ,
        },
        {
          title: "Délai de livraison des flux",
          url: "/pilotages/deliverable-delay-flows",
          permission: PERMISSIONS.DELIVERABLE_DELAY_FLOWS.READ,
        },
        {
          title: "Types de délai",
          url: "/pilotages/delay-types",
          permission: PERMISSIONS.DELAY_TYPES.READ,
        },
        {
          title: "Types de réquisition",
          url: "/pilotages/requisition-types",
          permission: PERMISSIONS.REQUISITION_TYPES.READ,
        },
        {
          title: "Types de demande",
          url: "/pilotages/request-types",
          permission: PERMISSIONS.REQUEST_TYPES.READ,
        },
        {
          title: "Types de conformité",
          url: "/pilotages/conformity-types",
          permission: PERMISSIONS.CONFORMITY_TYPES.READ,
        },
        {
          title: "Livrabes",
          url: "/pilotages/deliverables",
          permission: PERMISSIONS.DELIVERABLES.READ,
        },
        {
          title: "Flux de transmission",
          url: "/pilotages/flows",
          permission: PERMISSIONS.FLOWS.READ,
        },
        {
          title: "Fournisseurs",
          url: "/pilotages/providers",
          permission: PERMISSIONS.PROVIDERS.READ,
        },
        {
          title: "Fournisseur par services",
          url: "/pilotages/provider-service-categories",
          permission: PERMISSIONS.PROVIDER_SERVICE_CATEGORIES.READ,
        },
        {
          title: "Disponibilités fournisseur",
          url: "/pilotages/provider-disponibilities",
          permission: PERMISSIONS.PROVIDER_DISPONIBILITIES.READ,
        },
        {
          title: "Clients",
          url: "/pilotages/clients",
          permission: PERMISSIONS.CLIENTS.READ,
        },
        {
          title: "Subdivisions clients",
          url: "/pilotages/subdivision-clients",
          permission: PERMISSIONS.SUBDIVISION_CLIENTS.READ,
        },
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
      role: "admin",
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
