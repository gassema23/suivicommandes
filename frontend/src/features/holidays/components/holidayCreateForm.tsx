import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { holidaySchema, type HolidayFormData } from "../schemas/holiday.schema";
import { createHoliday } from "../services/create-holiday.service";
import FormError from "@/components/ui/shadcn/form-error";
import { Input } from "@/components/ui/shadcn/input";
import { Textarea } from "@/components/ui/shadcn/textarea";
import DatePicker from "@/components/ui/shadcn/date-picker";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { FormActions } from "@/components/forms/components/FormActions";
import InputContainer from "@/components/forms/components/InputContainer";
import { holidayFields } from "../configs/holiday-fields";
import { toast } from "sonner";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";

export default function HolidayCreateForm() {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<HolidayFormData>({
    resolver: zodResolver(holidaySchema),
    defaultValues: {
      holidayName: "",
      holidayDescription: "",
      holidayDate: undefined,
    },
  });

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = form;

  const createMutation = useMutation({
    mutationFn: (data: HolidayFormData) => createHoliday(data),
    onSuccess: () => {
      setBackendError(null);
      toast.success(SUCCESS_MESSAGES.create("Jour férié"));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HOLIDAYS });
      navigate({ to: "/pilotages/holidays" });
    },
    onError: (error: { message: string }) => {
      setBackendError(error.message);
    },
  });
  const onSubmit = (data: HolidayFormData) => {
    createMutation.mutate(data);
  };

  return (
    <form
      className="xl:w-3xl w-full space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      {backendError && (
        <FormError
          title="Erreur lors de l'envoie du formulaire"
          message={backendError}
        />
      )}

      {holidayFields.map((field) => (
        <InputContainer
          key={field.name}
          label={field.label}
          error={errors[field.name]?.message}
          htmlFor={field.name}
          required={field.required}
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
        isLoading={createMutation.isPending}
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
