import { useState } from "react";
import type { Deliverable } from "../../../shared/deliverable/types/deliverable.type";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deliverableSchema,
  type DeliverableFormData,
} from "../schemas/deliverable.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateDeliverable } from "../services/update-deliverable.service";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import FormError from "@/components/ui/shadcn/form-error";
import InputContainer from "@/components/forms/components/InputContainer";
import { deliverableFields } from "../configs/deliverable-fields";
import { Input } from "@/components/ui/shadcn/input";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { FormActions } from "@/components/forms/components/FormActions";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";
import { formatErrorMessage, getFieldError } from "@/lib/utils";

interface DeliverableFormProps {
  deliverable: Deliverable;
}
export default function DeliverableUpdateForm({
  deliverable,
}: DeliverableFormProps) {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<DeliverableFormData>({
    resolver: zodResolver(deliverableSchema),
    defaultValues: {
      deliverableName: deliverable.deliverableName ?? "",
      deliverableDescription: deliverable.deliverableDescription ?? "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const updateMutation = useMutation({
    mutationFn: (data: DeliverableFormData) =>
      updateDeliverable(deliverable.id, data),
    onSuccess: () => {
      setBackendError(null);
      toast.success(SUCCESS_MESSAGES.update("Livrable"));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DELIVERABLES });
      navigate({ to: "/pilotages/deliverables", search: { page: 1 } });
    },
    onError: (error: { message: string }) => {
      setBackendError(formatErrorMessage(error));
    },
  });

  const onSubmit = (data: DeliverableFormData) => {
    updateMutation.mutate(data);
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
        isLoading={updateMutation.isPending}
        onCancel={() =>
          navigate({ to: "/pilotages/deliverables", search: { page: 1 } })
        }
      />
    </form>
  );
}
