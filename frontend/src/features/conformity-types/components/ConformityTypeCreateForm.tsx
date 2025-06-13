import { Input } from "@/components/ui/shadcn/input";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { FormActions } from "@/components/forms/components/FormActions";
import InputContainer from "@/components/forms/components/InputContainer";
import { useState } from "react";
import { conformityTypeFields } from "../configs/conformity-type-fields";
import FormError from "@/components/ui/shadcn/form-error";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  conformityTypeSchema,
  type ConformityTypeFormData,
} from "../schemas/conformity-type.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { useCreateConformityType } from "../services/create-conformity-type.service";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";
import { formatErrorMessage, getFieldError } from "@/lib/utils";

export default function ConformityTypeCreateForm() {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const createConformityType = useCreateConformityType();

  const form = useForm<ConformityTypeFormData>({
    resolver: zodResolver(conformityTypeSchema),
    defaultValues: {
      conformityTypeName: "",
      conformityTypeDescription: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const createMutation = useMutation({
    mutationFn: (data: ConformityTypeFormData) => createConformityType(data),
    onSuccess: () => {
      setBackendError(null);
      toast.success(SUCCESS_MESSAGES.create("Type de conformité"));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONFORMITY_TYPES });

      navigate({ to: "/pilotages/conformity-types", search: { page: 1 } });
    },
    onError: (error: { message: string }) => {
      setBackendError(formatErrorMessage(error));
    },
  });
  const onSubmit = (data: ConformityTypeFormData) => {
    createMutation.mutate(data);
  };

  return (
    <form
      className="xl:w-3xl w-full space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      {backendError && <FormError message={backendError} />}

      {conformityTypeFields.map((field) => (
        <InputContainer
          key={field.name}
          label={field.label}
          error={getFieldError<ConformityTypeFormData>(
            errors,
            field.name as keyof ConformityTypeFormData
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
          navigate({ to: "/pilotages/conformity-types", search: { page: 1 } })
        }
      />
    </form>
  );
}
