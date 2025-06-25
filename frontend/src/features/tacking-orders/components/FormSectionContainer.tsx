import { FormActions } from "@/components/forms/components/FormActions";
import { useTrackingOrderForm } from "../hooks/useTrackingOrderForm";
import { useTrackingOrderQueries } from "../hooks/useTrackingOrderQueries";
import { BasicInfoSection } from "./sections/BasicInfoSection";
import { ServiceInfoSection } from "./sections/ServiceInfoSection";
import { FormHeaderActions } from "./forms/FormHeaderActions";
import OrderDateSection from "./sections/OrderDateSection";

export default function FormSectionContainer() {
  const {
    form,
    backendError,
    watchers,
    handlers,
    mutation,
    processingDeadlineQuery,
  } = useTrackingOrderForm();
  const queries = useTrackingOrderQueries(watchers);

  return (
    <form onSubmit={form.handleSubmit(handlers.onSubmit)}>
      <FormHeaderActions />

      <div className="w-full grid-cols-12 grid gap-4 my-2">
        <BasicInfoSection
          form={form}
          requisitionTypes={queries.requisitionTypes}
          clients={queries.clients}
          subdivisionClients={queries.subdivisionClients}
          clientId={watchers.clientId}
        />

        <ServiceInfoSection
          form={form}
          sectors={queries.sectors}
          services={queries.services}
          serviceCategories={queries.serviceCategories}
          requestTypeServiceCategories={queries.requestTypeServiceCategories}
          requestTypeDelays={queries.requestTypeDelays}
          onSectorChange={handlers.handleSectorChange}
          onServiceChange={handlers.handleServiceChange}
          onServiceCategoryChange={handlers.handleServiceCategoryChange}
          onRequestTypeServiceCategoryChange={handlers.handleRequestTypeServiceCategoryChange}
          onRequestTypeDelayChange={handlers.handleRequestTypeDelayChange}
        />

        <OrderDateSection form={form} processingDeadlineQuery={processingDeadlineQuery} />
      </div>

      {backendError && (
        <div className="text-destructive text-sm mb-4">{backendError}</div>
      )}

      <FormActions
        isLoading={mutation.isPending}
        onCancel={handlers.handleCancel}
      />
    </form>
  );
}
