export const requestTypeServiceCategoryFields = [
  {
    name: "sectorId",
    label: "Secteur",
    component: "select-sector",
    placeholder: "Sélectionner un secteur",
  },
  {
    name: "serviceId",
    label: "Service",
    component: "select-service",
    placeholder: "Sélectionner un service",
  },
  {
    name: "serviceCategoryId",
    label: "Catégorie de service",
    component: "select-service-category",
    placeholder: "Sélectionner une catégorie de service",
  },
  {
    name: "requestTypeId",
    label: "Type de demande",
    component: "select-request-type",
    placeholder: "Sélectionner un type de demande",
  },
  {
    name: "availabilityDelay",
    label: "Délai de disponibilité",
    type: "number",
    component: "slider",
    placeholder: "Délai de disponibilité (en jours)",
    min: 0,
  },
  {
    name: "minimumRequiredDelay",
    label: "Délai minimum requis",
    type: "number",
    component: "slider",
    placeholder: "Délai minimum requis (en jours)",
    min: 0,
  },
  {
    name: "serviceActivationDelay",
    label: "Délai d'activation du service",
    type: "number",
    component: "slider",
    placeholder: "Délai d'activation du service (en jours)",
    min: 0,
  },
];
