import { DependentSelect } from "@/components/dependant-select/components/DependentSelect";
import InputContainer from "@/components/forms/components/InputContainer";
import type { TrackingOrderFormData } from "../../schema/tracking-order.schema";
import type { UseFormReturn } from "react-hook-form";
import type { Sector } from "@/shared/sectors/types/sector.type";
import type { Service } from "@/shared/services/types/service.type";
import type { ServiceCategory } from "@/shared/service-categories/types/service-category.type";
import type { RequestTypeServiceCategory } from "@/shared/request-type-service-categories/types/request-type-service-category.type";
import type { RequestTypeDelay } from "@/shared/request-type-delays/types/request-type-delay.type";

type ServiceInfoSectionProps = {
  form: UseFormReturn<TrackingOrderFormData>;
  sectors: {
    data: Sector[] | undefined;
    isLoading: boolean;
    isError: boolean;
  };
  services: {
    data: Service[] | undefined;
    isLoading: boolean;
    isError: boolean;
  };
  serviceCategories: {
    data: ServiceCategory[] | undefined;
    isLoading: boolean;
    isError: boolean;
  };
  requestTypeServiceCategories: {
    data: RequestTypeServiceCategory[] | undefined;
    isLoading: boolean;
    isError: boolean;
  };
  requestTypeDelays: {
    data: RequestTypeDelay[] | undefined;
    isLoading: boolean;
    isError: boolean;
  };
  onSectorChange: (value: string) => void;
  onServiceChange: (value: string) => void;
  onServiceCategoryChange: (value: string) => void;
  onRequestTypeServiceCategoryChange: (value: string) => void;
  onRequestTypeDelayChange: (value: string) => void;
}

export function ServiceInfoSection({
  form,
  sectors,
  services,
  serviceCategories,
  requestTypeServiceCategories,
  requestTypeDelays,
  onSectorChange,
  onServiceChange,
  onServiceCategoryChange,
  onRequestTypeServiceCategoryChange,
  onRequestTypeDelayChange,
}: ServiceInfoSectionProps) {
  
  const {
    watch,
    setValue,
    formState: { errors },
  } = form;

  return (
    <div className="col-span-12 xl:col-span-4 space-y-2">
      <InputContainer
        label="Secteur"
        error={errors.sectorId?.message}
        htmlFor="sectorId"
        required
      >
        <DependentSelect
          value={watch("sectorId")}
          onChange={onSectorChange}
          data={sectors.data}
          isLoading={sectors.isLoading}
          isError={sectors.isError}
          placeholder="Sélectionner un secteur"
          getOptionValue={(s) => s.id}
          getOptionLabel={(s) => s.sectorName}
        />
      </InputContainer>

      <InputContainer
        label="Service"
        error={errors.serviceId?.message}
        htmlFor="serviceId"
        required
      >
        <DependentSelect
          value={watch("serviceId")}
          onChange={onServiceChange}
          data={services.data}
          isLoading={services.isLoading}
          isError={services.isError}
          placeholder="Sélectionner un service"
          getOptionValue={(s) => s.id}
          getOptionLabel={(s) => s.serviceName}
        />
      </InputContainer>

      <InputContainer
        label="Catégorie de service"
        error={errors.serviceCategoryId?.message}
        htmlFor="serviceCategoryId"
        required
      >
        <DependentSelect
          value={watch("serviceCategoryId")}
          onChange={onServiceCategoryChange}
          data={serviceCategories.data}
          isLoading={serviceCategories.isLoading}
          isError={serviceCategories.isError}
          placeholder="Sélectionner une catégorie de service"
          getOptionValue={(s) => s.id}
          getOptionLabel={(s) => s.serviceCategoryName}
        />
      </InputContainer>

      <InputContainer
        label="Type de demande"
        error={errors.requestTypeServiceCategoryId?.message}
        htmlFor="requestTypeServiceCategoryId"
        required
      >
        <DependentSelect
          value={watch("requestTypeServiceCategoryId")}
          onChange={onRequestTypeServiceCategoryChange}
          data={requestTypeServiceCategories.data}
          isLoading={requestTypeServiceCategories.isLoading}
          isError={requestTypeServiceCategories.isError}
          placeholder="Sélectionner un type de demande"
          getOptionValue={(s) => s.id}
          getOptionLabel={(s) => s.requestType.requestTypeName || "N/A"}
        />
      </InputContainer>

      <InputContainer
        label="Type de délai"
        error={errors.requestTypeDelayId?.message}
        htmlFor="requestTypeDelayId"
        required
      >
        <DependentSelect
          value={watch("requestTypeDelayId")}
          onChange={onRequestTypeDelayChange}
          data={requestTypeDelays.data}
          isLoading={requestTypeDelays.isLoading}
          isError={requestTypeDelays.isError}
          placeholder="Sélectionner un type de délai"
          getOptionValue={(s) => s.id}
          getOptionLabel={(s) => s.delayType.delayTypeName || "N/A"}
        />
      </InputContainer>
    </div>
  );
}
