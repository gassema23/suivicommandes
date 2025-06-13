import type { Holiday } from "../types/holiday.type";
import { Input } from "@/components/ui/shadcn/input";
import FormError from "@/components/ui/shadcn/form-error";
import { holidaySchema, type HolidayFormData } from "../schemas/holiday.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "@/components/ui/shadcn/date-picker";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { useUpdateHoliday } from "../services/update-holiday.service";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { FormActions } from "@/components/forms/components/FormActions";
import InputContainer from "@/components/forms/components/InputContainer";
import { holidayFields } from "../configs/holiday-fields";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";
import { toast } from "sonner";
import { formatErrorMessage, getFieldError } from "@/lib/utils";

interface HolidayFormProps {
  holiday: Holiday;
}

export default function HolidayUpdateForm({ holiday }: HolidayFormProps) {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const updateHoliday = useUpdateHoliday();

  const form = useForm<HolidayFormData>({
    resolver: zodResolver(holidaySchema),
    defaultValues: {
      holidayName: holiday?.holidayName ?? "",
      holidayDescription: holiday?.holidayDescription ?? "",
      holidayDate: holiday?.holidayDate ?? undefined,
    },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const updateMutation = useMutation({
    mutationFn: (data: HolidayFormData) => updateHoliday(holiday.id, data),
    onSuccess: () => {
      setBackendError(null);
      toast.success(SUCCESS_MESSAGES.update("Jour férié"));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HOLIDAYS });
      navigate({ to: "/pilotages/holidays", search: { page: 1 } });
    },
    onError: (error: { message: string }) => {
      setBackendError(formatErrorMessage(error));
    },
  });

  const onSubmit = (data: HolidayFormData) => {
    console.log("Submitting data:", data);
    updateMutation.mutate(data);
  };

  return (
    <form
      className="xl:w-3xl w-full space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      {backendError && <FormError message={backendError} />}

      {holidayFields.map((field) => (
        <InputContainer
          key={field.name}
          label={field.label}
          error={getFieldError<HolidayFormData>(
            errors,
            field.name as keyof HolidayFormData
          )}
          htmlFor={field.name}
          required={field?.required}
        >
          {field.component === "input" && (
            <Input
              type={field.type}
              className="block w-full"
              id={field.name}
              placeholder={field.placeholder}
              {...register(field.name)}
            />
          )}
          {field.component === "textarea" && (
            <Textarea
              rows={field.rows}
              className="block w-full"
              id={field.name}
              placeholder={field.placeholder}
              {...register(field.name)}
            />
          )}
          {field.component === "date-picker" && (
            <Controller
              control={control}
              name="holidayDate"
              render={({ field }) => (
                <DatePicker
                  mode="single"
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                />
              )}
            />
          )}
        </InputContainer>
      ))}

      <FormActions
        isLoading={updateMutation.isPending}
        onCancel={() =>
          navigate({
            to: "/pilotages/holidays",
            search: { page: 1 },
          })
        }
      />
    </form>
  );
}
