import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  passwordSchema,
  type PasswordFormData,
} from "../schemas/password.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { useUpdateSecurityInformation } from "../services/update-security-information.service";
import FormError from "@/components/ui/shadcn/form-error";
import PasswordInput from "@/components/ui/shadcn/password-input";
import { toast } from "sonner";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";
import InputContainer from "@/components/forms/components/InputContainer";
import { profileSecurityFields } from "../configs/profile-security-fields";
import { formatErrorMessage, getFieldError } from "@/lib/utils";
import { FormActions } from "@/components/forms/components/FormActions";

export default function ProfileSecurityForm({ userId }: { userId: string }) {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
    const updateSecutiryInformation = useUpdateSecurityInformation();

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

  const updateMutation = useMutation({
    mutationFn: (data: PasswordFormData) => updateSecutiryInformation(userId, data),
    onSuccess: async () => {
      setBackendError(null);
      reset();
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILE }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ME }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS }),
      ]);
      toast.success(SUCCESS_MESSAGES.update("Mot de passe"));
      navigate({ to: "/profile" });
    },
    onError: (error: { message: string }) => {
      setBackendError(formatErrorMessage(error));
    },
  });

  const onSubmit = (data: PasswordFormData) => {
    updateMutation.mutate(data);
  };
  return (
    <form
      className="xl:w-3xl w-full space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h3 className="title-md">Sécurité</h3>
      <p className="subtitle">
        Gérez vos paramètres de sécurité et mot de passe.
      </p>
      {backendError && <FormError message={backendError} />}
      {profileSecurityFields.map((field) => (
        <InputContainer
          key={field.name}
          label={field.label}
          error={getFieldError<PasswordFormData>(
            errors,
            field.name as keyof PasswordFormData
          )}
          htmlFor={field.name}
          required={field?.required}
        >
          {field.component === "password" && (
            <PasswordInput
              type={field.type}
              className="block w-full"
              id={field.name}
              placeholder={field.placeholder}
              {...register(field.name)}
            />
          )}
        </InputContainer>
      ))}

      {/* Actions du formulaire */}
      <div className="flex gap-4 justify-end">
        <FormActions isLoading={updateMutation.isPending} />
      </div>
    </form>
  );
}
