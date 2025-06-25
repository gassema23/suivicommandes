import { Input } from "@/components/ui/shadcn/input";
import { DependentSelect } from "@/components/dependant-select/components/DependentSelect";
import { Combobox } from "@/components/ui/shadcn/combobox";
import InputContainer from "@/components/forms/components/InputContainer";
import type { TrackingOrderFormData } from "@/features/tacking-orders/schema/tracking-order.schema";
import type { UseFormReturn } from "react-hook-form";
import type { RequisitionType } from "@/shared/requisition-types/types/requisition-type.type";
import type { Client } from "@/shared/clients/types/client.type";
import type { SubdivisionClient } from "@/shared/subdivision-clients/types/subdivision-client.type";

interface BasicInfoSectionProps {
  form: UseFormReturn<TrackingOrderFormData>;
  requisitionTypes: {
    data: RequisitionType[] | undefined;
    isLoading: boolean;
    isError: boolean;
  };
  clients: {
    data: Client[] | undefined;
    isLoading: boolean;
    isError: boolean;
  };
  subdivisionClients: {
    data: SubdivisionClient[] | undefined;
    isLoading: boolean;
    isError: boolean;
  };
  clientId: string;
}

export function BasicInfoSection({
  form,
  requisitionTypes,
  clients,
  subdivisionClients,
  clientId,
}: BasicInfoSectionProps) {
  const { register, watch, setValue, formState: { errors } } = form;

  return (
    <div className="col-span-12 xl:col-span-4 space-y-2">
      <InputContainer
        label="Type de réquisition"
        error={errors.requisitionTypeId?.message}
        htmlFor="requisitionTypeId"
        required
      >
        <DependentSelect
          value={watch("requisitionTypeId")}
          onChange={(value) => setValue("requisitionTypeId", value)}
          data={requisitionTypes.data}
          isLoading={requisitionTypes.isLoading}
          isError={requisitionTypes.isError}
          placeholder="Sélectionner un type de réquisition"
          getOptionValue={(s) => s.id}
          getOptionLabel={(s) => s.requisitionTypeName}
        />
      </InputContainer>

      <InputContainer
        label="N° de commande"
        error={errors.order_number?.message}
        htmlFor="order_number"
        required
      >
        <Input
          id="order_number"
          type="text"
          placeholder="555555"
          {...register("order_number")}
        />
      </InputContainer>

      <InputContainer
        label="N° de réquisition"
        error={errors.requisition_number?.message}
        htmlFor="requisition_number"
        required
      >
        <Input
          id="requisition_number"
          type="text"
          placeholder="REQ-1234"
          {...register("requisition_number")}
        />
      </InputContainer>

      <InputContainer
        label="Client"
        error={errors.clientId?.message}
        htmlFor="clientId"
        required
      >
        <Combobox
          placeholder="Sélectionner un client"
          data={clients.data}
          isLoading={clients.isLoading}
          isError={clients.isError}
          value={watch("clientId")}
          onValueChange={(value) => setValue("clientId", value)}
          getOptionValue={(s) => s.id}
          getOptionLabel={(s) => s.virtualClientName}
        />
      </InputContainer>

      <InputContainer
        label="Subdivision client"
        error={errors.subdivisionClientId?.message}
        htmlFor="subdivisionClientId"
        required
      >
        <Combobox
          placeholder="Sélectionner une subdivision client"
          data={subdivisionClients.data}
          isLoading={subdivisionClients.isLoading}
          isError={subdivisionClients.isError}
          disabled={!clientId || subdivisionClients.data?.length === 0}
          value={watch("subdivisionClientId")}
          onValueChange={(value) => setValue("subdivisionClientId", value)}
          getOptionValue={(s) => s.id}
          getOptionLabel={(s) => s.virtualSubdivisionClientName || ""}
        />
      </InputContainer>
    </div>
  );
}