export const requestTypeDelayFields = [
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
    name: "requestTypeServiceCategoryId",
    label: "Type de demande",
    component: "select-request-type-service-category",
    placeholder: "Sélectionner un type de demande",
  },
  {
    name: "delayType",
    label: "Type de délai",
    component: "select-delay-type",
    placeholder: "Sélectionner un type de délai",
  },
  {
    name: "delayValue",
    label: "Délai en jours",
    type: "number",
    component: "slider",
    placeholder: "Délai en jours",
    min: 0,
  },
];
