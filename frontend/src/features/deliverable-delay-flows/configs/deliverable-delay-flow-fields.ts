import type { FieldConfig } from "@/types/field.type";
import type { DeliverableDelayFlowFormData } from "../schemas/deliverable-delay-flow.schema";

export const deliverableDelayFlowFields: FieldConfig<DeliverableDelayFlowFormData>[] =
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
      name: "deliverableDelayRequestTypeId",
      label: "Livrable",
      component: "select-deliverable-delay-request-type",
      placeholder: "Sélectionner un livrable",
    },
    {
      name: "flowId",
      label: "Flux de transmission",
      component: "select-flow",
      placeholder: "Sélectionner un flux de transmission",
    },
  ];
