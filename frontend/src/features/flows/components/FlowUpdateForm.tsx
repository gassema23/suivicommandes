import { useState } from "react";
import type { Flow } from "../types/flow.type";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { flowSchema, type FlowFormData } from "../schemas/flow.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateFlow } from "../services/update-flow.service";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import FormError from "@/components/ui/shadcn/form-error";
import InputContainer from "@/components/forms/components/InputContainer";
import { flowFields } from "../configs/flow-fields";
import { Input } from "@/components/ui/shadcn/input";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { FormActions } from "@/components/forms/components/FormActions";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";
import { formatErrorMessage, getFieldError } from "@/lib/utils";

interface FlowFormProps {
  flow: Flow;
}
export default function FlowUpdateForm({ flow }: FlowFormProps) {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const updateFlow = useUpdateFlow();

  const form = useForm<FlowFormData>({
    resolver: zodResolver(flowSchema),
    defaultValues: {
      flowName: flow.flowName ?? "",
      flowDescription: flow.flowDescription ?? "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const updateMutation = useMutation({
    mutationFn: (data: FlowFormData) => updateFlow(flow.id, data),
    onSuccess: () => {
      setBackendError(null);
      toast.success(SUCCESS_MESSAGES.update("Flux de tranmission"));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FLOWS });
      navigate({ to: "/pilotages/flows", search: { page: 1 } });
    },
    onError: (error: { message: string }) => {
      setBackendError(formatErrorMessage(error));
    },
  });

  const onSubmit = (data: FlowFormData) => {
    updateMutation.mutate(data);
  };
  return (
    <form
      className="xl:w-3xl w-full space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      {backendError && <FormError message={backendError} />}

      {flowFields.map((field) => (
        <InputContainer
          key={field.name}
          label={field.label}
          error={getFieldError<FlowFormData>(
            errors,
            field.name as keyof FlowFormData
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
          navigate({ to: "/pilotages/flows", search: { page: 1 } })
        }
      />
    </form>
  );
}
