import type { FieldConfig } from "@/types/field.type";
import type { DeliverableDelayRequestTypeFormData } from "../schemas/deliverable-delay-request-type.schema";

export const deliverableDelayRequestTypeFields: FieldConfig<DeliverableDelayRequestTypeFormData>[] =
  [
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
      label: "Type de demande par catégorie de service",
      component: "select-request-type-service-category",
      placeholder: "Sélectionner un type de demande par catégorie de service",
    },
    {
      name: "deliverableId",
      label: "Livrable",
      component: "select-deliverable",
      placeholder: "Sélectionner un type de livrable",
    },
  ];
