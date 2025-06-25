import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import FormError from "@/components/ui/shadcn/form-error";
import InputContainer from "@/components/forms/components/InputContainer";
import { Input } from "@/components/ui/shadcn/input";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { FormActions } from "@/components/forms/components/FormActions";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";
import type { RequisitionType } from "../../../shared/requisition-types/types/requisition-type.type";
import {
  requisitionTypeSchema,
  type RequisitionTypeFormData,
} from "../schemas/requisition-type.schema";
import { requisitionTypeFields } from "../configs/requisition-type-fields";
import { updateRequisitionType } from "../services/update-requisition-type.service";
import { formatErrorMessage } from "@/lib/utils";

interface RequisitionTypeFormProps {
  requisitionType: RequisitionType;
}
export default function RequisitionTypeUpdateForm({
  requisitionType,
}: RequisitionTypeFormProps) {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<RequisitionTypeFormData>({
    resolver: zodResolver(requisitionTypeSchema),
    defaultValues: {
      requisitionTypeName: requisitionType.requisitionTypeName ?? "",
      requisitionTypeDescription:
        requisitionType.requisitionTypeDescription ?? "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const updateMutation = useMutation({
    mutationFn: (data: RequisitionTypeFormData) =>
      updateRequisitionType(requisitionType.id, data),
    onSuccess: () => {
      setBackendError(null);
      toast.success(SUCCESS_MESSAGES.update("Type de réquisition"));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REQUISITION_TYPES });
      navigate({ to: "/pilotages/requisition-types", search: { page: 1 } });
    },
    onError: (error: { message: string }) => {
      setBackendError(formatErrorMessage(error));
    },
  });

  const onSubmit = (data: RequisitionTypeFormData) => {
    updateMutation.mutate(data);
  };
  return (
    <form
      className="xl:w-3xl w-full space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      {backendError && <FormError message={backendError} />}

      {requisitionTypeFields.map((field) => (
        <InputContainer
          key={field.name}
          label={field.label}
          error={errors[field.name]?.message}
          htmlFor={field.name}
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
          navigate({ to: "/pilotages/requisition-types", search: { page: 1 } })
        }
      />
    </form>
  );
}
