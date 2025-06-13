import { Input } from "@/components/ui/shadcn/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import FormError from "@/components/ui/shadcn/form-error";
import {
  userInformationSchema,
  type UserInformationFormData,
} from "../schemas/user-information.schema";
import { useUpdateUserInformation } from "../services/update-user-information.service";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { toast } from "sonner";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";
import { formatErrorMessage, getFieldError } from "@/lib/utils";
import InputContainer from "@/components/forms/components/InputContainer";
import { profileInformationFields } from "../configs/profile-information-fields";
import { FormActions } from "@/components/forms/components/FormActions";

interface InformationFormProps {
  user: User;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function InformationForm({ user }: InformationFormProps) {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const updateUserInformation = useUpdateUserInformation();

  const form = useForm<UserInformationFormData>({
    resolver: zodResolver(userInformationSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = form;

  const updateMutation = useMutation({
    mutationFn: (data: UserInformationFormData) =>
      updateUserInformation(user.id, data),
    onSuccess: async () => {
      setBackendError(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILE }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ME }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS }),
      ]);

      toast.success(SUCCESS_MESSAGES.update("Informations personnelles"));
      navigate({ to: "/profile" });
    },
    onError: (error: { message: string }) => {
      setBackendError(formatErrorMessage(error));
    },
  });

  useEffect(() => {
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  }, [user, reset]);

  const onSubmit = (data: UserInformationFormData) => {
    updateMutation.mutate(data);
  };
  return (
    <form
      className="xl:w-3xl w-full space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="title-md">Informations personnelles</h2>
      <p className="subtitle">
        Mettez à jour vos informations personnelles ici.
      </p>
      {backendError && <FormError message={backendError} />}

      {profileInformationFields.map((field) => (
        <InputContainer
          key={field.name}
          label={field.label}
          error={getFieldError<UserInformationFormData>(
            errors,
            field.name as keyof UserInformationFormData
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
        </InputContainer>
      ))}

      {/* Actions du formulaire */}
      <div className="flex gap-4 justify-end">
        <FormActions isLoading={updateMutation.isPending} disabled={!isDirty} />
      </div>
    </form>
  );
}
