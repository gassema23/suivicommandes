import { Input } from "@/components/ui/shadcn/input";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { FormActions } from "@/components/forms/components/FormActions";
import InputContainer from "@/components/forms/components/InputContainer";
import { useState } from "react";
import { deliverableFields } from "../configs/deliverable-fields";
import FormError from "@/components/ui/shadcn/form-error";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  deliverableSchema,
  type DeliverableFormData,
} from "../schemas/deliverable.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { useCreateDeliverable } from "../services/create-deliverable.service";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";
import { formatErrorMessage, getFieldError } from "@/lib/utils";

export default function DeliverableCreateForm() {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const createDeliverable = useCreateDeliverable();

  const form = useForm<DeliverableFormData>({
    resolver: zodResolver(deliverableSchema),
    defaultValues: {
      deliverableName: "",
      deliverableDescription: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const createMutation = useMutation({
    mutationFn: (data: DeliverableFormData) => createDeliverable(data),
    onSuccess: () => {
      setBackendError(null);
      toast.success(SUCCESS_MESSAGES.create("Livrable"));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DELIVERABLES });

      navigate({ to: "/pilotages/deliverables", search: { page: 1 } });
    },
    onError: (error: { message: string }) => {
      setBackendError(formatErrorMessage(error));
    },
  });
  const onSubmit = (data: DeliverableFormData) => {
    createMutation.mutate(data);
  };

  return (
    <form
      className="xl:w-3xl w-full space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      {backendError && <FormError message={backendError} />}

      {deliverableFields.map((field) => (
        <InputContainer
          key={field.name}
          label={field.label}
          error={getFieldError<DeliverableFormData>(
            errors,
            field.name as keyof DeliverableFormData
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
          navigate({ to: "/pilotages/deliverables", search: { page: 1 } })
        }
      />
    </form>
  );
}
