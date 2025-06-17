import type { FieldConfig } from "@/types/field.type";
import type { ProviderServiceCategoryFormData } from "../schemas/provider-service-category.schema";

export const providerServiceCategoryFields: FieldConfig<ProviderServiceCategoryFormData>[] =
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
      name: "providerId",
      label: "Fournisseur",
      component: "select-provider",
      placeholder: "Sélectionner un fournisseur",
    },
  ];
