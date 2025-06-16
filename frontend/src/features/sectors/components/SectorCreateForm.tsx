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
import { createSector } from "../services/create-sector.service";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { toast } from "sonner";
import { FormActions } from "@/components/forms/components/FormActions";
import InputContainer from "@/components/forms/components/InputContainer";
import { sectorFields } from "../configs/sector-fields";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";
import { formatErrorMessage, getFieldError } from "@/lib/utils";

export default function SectorCreateForm() {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<SectorFormData>({
    resolver: zodResolver(sectorSchema),
    defaultValues: {
      sectorName: "",
      sectorDescription: "",
      sectorClientTimeEnd: "",
      sectorProviderTimeEnd: "",
      isAutoCalculate: false,
      isConformity: false,
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  const createSectorMutation = useMutation({
    mutationFn: (data: SectorFormData) => createSector(data),
    onSuccess: () => {
      setBackendError(null);
      toast.success(SUCCESS_MESSAGES.create("Secteur"));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SECTORS });
      navigate({ to: "/pilotages/sectors", search: { page: 1 } });
    },
    onError: (error: { message: string }) => {
      setBackendError(formatErrorMessage(error));
    },
  });
  const onSubmit = (data: SectorFormData) => {
    createSectorMutation.mutate(data);
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
              name={field.name}
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
        isLoading={createSectorMutation.isPending}
        onCancel={() =>
          navigate({ to: "/pilotages/sectors", search: { page: 1 } })
        }
      />
    </form>
  );
}
