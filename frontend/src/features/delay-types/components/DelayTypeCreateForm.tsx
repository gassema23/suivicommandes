import { Input } from "@/components/ui/shadcn/input";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { FormActions } from "@/components/forms/components/FormActions";
import InputContainer from "@/components/forms/components/InputContainer";
import { useState } from "react";
import { delayTypeFields } from "../configs/delay-type-fields";
import FormError from "@/components/ui/shadcn/form-error";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  delayTypeSchema,
  type DelayTypeFormData,
} from "../schemas/delay-type.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { useCreateDelayType } from "../services/create-delay-type.service";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";
import { formatErrorMessage, getFieldError } from "@/lib/utils";

export default function DelayTypeCreateForm() {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const createDelayType = useCreateDelayType();

  const form = useForm<DelayTypeFormData>({
    resolver: zodResolver(delayTypeSchema),
    defaultValues: {
      delayTypeName: "",
      delayTypeDescription: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const createMutation = useMutation({
    mutationFn: (data: DelayTypeFormData) => createDelayType(data),
    onSuccess: () => {
      setBackendError(null);
      toast.success(SUCCESS_MESSAGES.create("Type de délai"));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DELAY_TYPES });

      navigate({ to: "/pilotages/delay-types", search: { page: 1 } });
    },
    onError: (error: { message: string }) => {
      setBackendError(formatErrorMessage(error));
    },
  });
  const onSubmit = (data: DelayTypeFormData) => {
    createMutation.mutate(data);
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
        isLoading={createMutation.isPending}
        onCancel={() =>
          navigate({ to: "/pilotages/delay-types", search: { page: 1 } })
        }
      />
    </form>
  );
}
