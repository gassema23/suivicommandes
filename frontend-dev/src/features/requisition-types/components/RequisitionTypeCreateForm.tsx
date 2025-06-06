import { Input } from "@/components/ui/shadcn/input";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { FormActions } from "@/features/common/forms/components/FormActions";
import InputContainer from "@/features/common/forms/components/InputContainer";
import { useState } from "react";
import FormError from "@/components/ui/shadcn/form-error";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/features/common/constants/query-key.constant";
import { SUCCESS_MESSAGES } from "@/features/common/constants/messages.constant";
import { requisitionTypeSchema, type RequisitionTypeFormData } from "../schemas/requisition-type.schema";
import { createRequisitionType } from "../services/create-requisition-type.service";
import { requisitionTypeFields } from "../configs/requisition-type-fields";

export default function RequisitionTypeCreateForm() {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<RequisitionTypeFormData>({
    resolver: zodResolver(requisitionTypeSchema),
    defaultValues: {
      requisitionTypeName: "",
      requisitionTypeDescription: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const createMutation = useMutation({
    mutationFn: (data: RequisitionTypeFormData) => createRequisitionType(data),
    onSuccess: () => {
      setBackendError(null);
      toast.success(SUCCESS_MESSAGES.create("Type de réquisition"));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REQUISITION_TYPES });

      navigate({ to: "/pilotages/requisition-types", search: { page: 1 } });
    },
    onError: (error: { message: string }) => {
      setBackendError(error.message);
    },
  });
  const onSubmit = (data: RequisitionTypeFormData) => {
    createMutation.mutate(data);
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
        isLoading={createMutation.isPending}
        onCancel={() =>
          navigate({ to: "/pilotages/requisition-types", search: { page: 1 } })
        }
      />
    </form>
  );
}
