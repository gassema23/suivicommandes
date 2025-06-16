import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import FormError from "@/components/ui/shadcn/form-error";
import { Input } from "@/components/ui/shadcn/input";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { sectorSchema, type SectorFormData } from "../schemas/sector.schema";
import { Controller, useForm } from "react-hook-form";
import { Switch } from "@/components/ui/shadcn/switch";
import { updateSector } from "../services/update-sector.service";
import type { Sector } from "@/shared/sectors/types/sector.type";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { toast } from "sonner";
import { FormActions } from "@/components/forms/components/FormActions";
import { sectorFields } from "../configs/sector-fields";
import InputContainer from "@/components/forms/components/InputContainer";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";
import { formatErrorMessage, getFieldError } from "@/lib/utils";

interface SectorFormProps {
  sector: Sector;
}

export default function SectorUpdateForm({ sector }: SectorFormProps) {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<SectorFormData>({
    resolver: zodResolver(sectorSchema),
    defaultValues: {
      sectorName: sector?.sectorName ?? "",
      sectorDescription: sector?.sectorDescription ?? "",
      sectorClientTimeEnd: sector?.sectorClientTimeEnd ?? "",
      sectorProviderTimeEnd: sector?.sectorProviderTimeEnd ?? "",
      isAutoCalculate: sector?.isAutoCalculate ?? false,
      isConformity: sector?.isConformity ?? false,
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  const updateSectorMutation = useMutation({
    mutationFn: (data: SectorFormData) => updateSector(sector.id, data),
    onSuccess: () => {
      setBackendError(null);
      toast.success(SUCCESS_MESSAGES.update("Secteur"));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SECTORS });
      navigate({ to: "/pilotages/sectors", search: { page: 1 } });
    },
    onError: (error: { message: string }) => {
      setBackendError(formatErrorMessage(error));
    },
  });
  const onSubmit = (data: SectorFormData) => {
    updateSectorMutation.mutate(data);
  };

  return (
    <form
      className="xl:w-3xl w-full space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      {backendError && <FormError message={backendError} />}

      {sectorFields.map((field) => (
        <InputContainer
          key={field.name}
          label={field.label}
          error={getFieldError<SectorFormData>(
            errors,
            field.name as keyof SectorFormData
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
          {field.component === "switch" && (
            <Controller
              control={control}
              name={field.name as keyof SectorFormData}
              render={({ field: ctrlField }) => (
                <Switch
                  id={field.name}
                  checked={!!ctrlField.value}
                  onCheckedChange={ctrlField.onChange}
                />
              )}
            />
          )}
        </InputContainer>
      ))}

      <FormActions
        isLoading={updateSectorMutation.isPending}
        onCancel={() =>
          navigate({ to: "/pilotages/sectors", search: { page: 1 } })
        }
      />
    </form>
  );
}
