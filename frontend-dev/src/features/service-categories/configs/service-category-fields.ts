export const serviceCategoryFields = [
  {
    name: "sectorId",
    label: "Secteur",
    component: "select-sector",
    placeholder: "Sélectionner un secteur",
  },
  {
    name: "serviceId",
    label: "Services",
    component: "select-service",
    placeholder: "Sélectionner un service",
  },
  {
    name: "serviceCategoryName",
    label: "Catégorie du service",
    component: "input",
    type: "text",
    placeholder: "Nom de la catégorie",
  },
  {
    name: "isMultiLink",
    label: "Multi-liens",
    component: "switch",
  },
  {
    name: "isMultiProvider",
    label: "Multi-fournisseurs",
    component: "switch",
  },
  {
    name: "isRequiredExpertise",
    label: "Expertise requise",
    component: "switch",
  },
  {
    name: "serviceCategoryDescription",
    label: "Description",
    component: "textarea",
    rows: 3,
    placeholder: "Description de la catégorie",
  },
];
