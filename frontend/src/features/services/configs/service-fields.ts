
export const serviceFields = [
  {
    name: "sectorId",
    label: "Secteur",
    component: "select",
    placeholder: "Sélectionner un secteur",
    required: true,
  },
  {
    name: "serviceName",
    label: "Service",
    component: "input",
    type: "text",
    placeholder: "Nom du service",
    required: true,
  },
  {
    name: "serviceDescription",
    label: "Description",
    component: "textarea",
    rows: 3,
    placeholder: "Description du service",
  },
];
