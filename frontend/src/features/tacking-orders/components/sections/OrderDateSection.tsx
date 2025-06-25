import { Controller, type UseFormReturn } from "react-hook-form";
import type { TrackingOrderFormData } from "../../schema/tracking-order.schema";
import InputContainer from "@/components/forms/components/InputContainer";
import DatePicker from "@/components/ui/shadcn/date-picker";
import { Input } from "@/components/ui/shadcn/input";
import type { useTrackingOrderForm } from "../../hooks/useTrackingOrderForm";
import { ProcessingDeadlineDisplay } from "./ProcessingDeadlineDisplay";

interface OrderDateSectionProps {
  form: UseFormReturn<TrackingOrderFormData>;
  processingDeadlineQuery: ReturnType<
    typeof useTrackingOrderForm
  >["processingDeadlineQuery"];
}

export default function OrderDateSection({
  form,
  processingDeadlineQuery,
}: OrderDateSectionProps) {
  const {
    register,
    watch,
    setValue,
    control,
    formState: { errors },
  } = form;

  return (
    <div className="col-span-12 xl:col-span-4 space-y-2">
      <InputContainer
        label="Date d'inscription de la réquisition"
        error={errors.order_registration_at?.message}
        htmlFor="order_registration_at"
        required
      >
        <Controller
          control={control}
          name="order_registration_at"
          render={({ field }) => (
            <DatePicker
              mode="single"
              className="w-full"
              value={field.value ? new Date(field.value) : undefined}
              onChange={(date) => field.onChange(date)}
            />
          )}
        />
      </InputContainer>

      <InputContainer
        label="Heure d'inscription de la réquisition"
        error={errors.order_registration_time?.message}
        htmlFor="order_registration_time"
        required
      >
        <Input
          className="w-full block"
          type="time"
          id="order_registration_time"
          {...register("order_registration_time")}
        />
      </InputContainer>

      <InputContainer label="Heure d'inscription de la réquisition">
        <div className="col-span-12 xl:col-span-4">
          <ProcessingDeadlineDisplay
            processingDeadlineQuery={processingDeadlineQuery}
          />
        </div>
      </InputContainer>
    </div>
  );
}
