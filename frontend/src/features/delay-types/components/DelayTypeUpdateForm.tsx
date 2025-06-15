import { useState } from "react";
import type { DelayType } from "@/shared/delay-types/types/delay-type.type";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  delayTypeSchema,
  type DelayTypeFormData,
} from "../schemas/delay-type.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateDelayType } from "../services/update-delay-type.service";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import FormError from "@/components/ui/shadcn/form-error";
import InputContainer from "@/components/forms/components/InputContainer";
import { delayTypeFields } from "../configs/delay-type-fields";
import { Input } from "@/components/ui/shadcn/input";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { FormActions } from "@/components/forms/components/FormActions";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";
import { formatErrorMessage, getFieldError } from "@/lib/utils";

interface DelayTypeFormProps {
  delayType: DelayType;
}
export default function DelayTypeUpdateForm({ delayType }: DelayTypeFormProps) {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const updateDelayType = useUpdateDelayType();

  const form = useForm<DelayTypeFormData>({
    resolver: zodResolver(delayTypeSchema),
    defaultValues: {
      delayTypeName: delayType.delayTypeName ?? "",
      delayTypeDescription: delayType.delayTypeDescription ?? "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const updateMutation = useMutation({
    mutationFn: (data: DelayTypeFormData) =>
      updateDelayType(delayType.id, data),
    onSuccess: () => {
      setBackendError(null);
      toast.success(SUCCESS_MESSAGES.update("Type de délai"));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DELAY_TYPES });
      navigate({ to: "/pilotages/delay-types", search: { page: 1 } });
    },
    onError: (error: { message: string }) => {
      setBackendError(formatErrorMessage(error));
    },
  });

  const onSubmit = (data: DelayTypeFormData) => {
    updateMutation.mutate(data);
  };
  return (
    <form
      className="xl:w-3xl w-full space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      {backendError && <FormError message={backendError} />}

      {delayTypeFields.map((field) => (
        <InputContainer
          key={field.name}
          label={field.label}
          error={getFieldError<DelayTypeFormData>(
            errors,
            field.name as keyof DelayTypeFormData
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
        </InputContainer>
      ))}

      <FormActions
        isLoading={updateMutation.isPending}
        onCancel={() =>
          navigate({ to: "/pilotages/delay-types", search: { page: 1 } })
        }
      />
    </form>
  );
}
