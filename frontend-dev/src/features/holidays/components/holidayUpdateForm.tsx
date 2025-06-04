import { Button } from "@/components/ui/quebec/Button";
import type { Holiday } from "../types/holiday.type";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import FormError from "@/components/ui/shadcn/form-error";
import { holidaySchema, type HolidayFormData } from "../schemas/holiday.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "@/components/ui/shadcn/date-picker";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { updateHoliday } from "../services/update-holiday.service";
import { QUERY_KEYS } from "@/config/query-key";

interface HolidayFormProps {
  holiday: Holiday;
}

export default function HolidayUpdateForm({ holiday }: HolidayFormProps) {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

  const updateHolidayMutation = useMutation({
    mutationFn: (data: HolidayFormData) => updateHoliday(holiday.id, data),
    onSuccess: () => {
      setBackendError(null);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HOLIDAYS });
      navigate({ to: "/pilotages/holidays" });
    },
    onError: (error: { message: string }) => {
      setBackendError(error.message);
    },
  });

  const onSubmit = (data: HolidayFormData) => {
    updateHolidayMutation.mutate(data);
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
      <div className="grid grid-cols-12 gap-2 items-center">
        <Label className="col-span-12 xl:col-span-4" htmlFor="holidayName">
          Jour férié
        </Label>
        <div className="col-span-12 xl:col-span-8">
          <Input
            className="block w-full"
            id="holidayName"
            {...register("holidayName")}
            required
          />
          {errors.holidayName && (
            <p className="text-destructive text-sm mt-1">
              {errors.holidayName.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-12 gap-2 items-center">
        <Label className="col-span-12 xl:col-span-4">Date du jour férié</Label>
        <div className="col-span-12 xl:col-span-8">
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
          {errors.holidayDate && (
            <p className="text-destructive text-sm mt-1">
              {errors.holidayDate.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-12 gap-2 items-center">
        <Label
          className="col-span-12 xl:col-span-4"
          htmlFor="holidayDescription"
        >
          Description
        </Label>
        <div className="col-span-12 xl:col-span-8">
          <Textarea
            rows={3}
            className="block w-full"
            id="holidayDescription"
            {...register("holidayDescription")}
          />
          {errors.holidayDescription && (
            <p className="text-destructive text-sm mt-1">
              {errors.holidayDescription.message}
            </p>
          )}
        </div>
      </div>

      {/* Actions du formulaire */}
      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate({ to: "/pilotages/holidays" })}
          disabled={form.formState.isSubmitting}
        >
          Annuler
        </Button>

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Mise à jour..." : "Mettre à jour"}
        </Button>
      </div>
    </form>
  );
}
