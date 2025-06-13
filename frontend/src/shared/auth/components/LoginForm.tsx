"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSearch } from "@tanstack/react-router"
import type { z } from "zod"
import { Button } from "@/components/ui/quebec/Button"
import { Input } from "@/components/ui/shadcn/input"
import PasswordInput from "@/components/ui/shadcn/password-input"
import FormError from "@/components/ui/shadcn/form-error"
import ErrorMessage from "@/components/ui/shadcn/error-message"
import { useAuth } from "@/providers/auth.provider"
import { QuebecLink } from "@/components/ui/quebec/QuebecLink"
import { Label } from "@/components/ui/shadcn/label"
import { QUERY_KEYS } from "@/constants/query-key.constant"
import { loginSchema, type LoginFormData } from "../schema/login.schema"
import { useLogin } from "../services/login.service"

interface LoginFormProps {
  onSuccess: (token: string, email: string) => void
  className?: string
}

export default function LoginForm({ onSuccess, className = "" }: LoginFormProps) {
  const [backendError, setBackendError] = useState<string | null>(null)
  const search = useSearch({ from: "/_guest/(login)/login" })
  const { login, refetchUser } = useAuth()
  const queryClient = useQueryClient();
  const loginServiceMutation = useLogin();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  })

  const extractErrorMessage = (err: unknown): string => {
    if (err instanceof Error) return err.message
    if (typeof err === "object" && err !== null && "message" in err) {
      return String((err as { message?: unknown }).message)
    }
    return "Une erreur inconnue est survenue. Veuillez réessayer."
  }

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginFormData) => loginServiceMutation(credentials),
    onSuccess: async (data, _variables) => {
      // Vérifier si l'authentification à deux facteurs est requise
      if (data.requires2FA) {
        // Passer à l'étape de vérification 2FA
        onSuccess(data.sessionToken, _variables.email)
      } else {
        // Connexion standard sans 2FA
        await refetchUser()
        await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS })
        await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ME })
        login(search.redirect)
      }
    },
    onError: (error) => setBackendError(extractErrorMessage(error)),
  })

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    setBackendError(null)
    loginMutation.mutate(data)
  }

  return (
    <div className={className}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
        <h1 className="section-title">Connexion</h1>
        <p className="subtitle">Entrez votre adresse courriel ci-dessous pour vous connecter à votre compte</p>
        {backendError && <FormError title="Erreur" message={backendError} />}
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Adresse courriel</Label>
            <Input
              id="email"
              type="email"
              placeholder="John.Doe@example.com"
              {...form.register("email")}
              autoComplete="email"
            />
            <ErrorMessage message={form.formState.errors?.email?.message || ""} />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mot de passe</Label>
              <QuebecLink href="/forgot-password" className="text-sm">
                Mot de passe oublié?
              </QuebecLink>
            </div>
            <PasswordInput
              id="password"
              placeholder="Mot de passe"
              {...form.register("password")}
              autoComplete="current-password"
            />
            <ErrorMessage message={form.formState.errors?.password?.message || ""} />
          </div>
          <Button type="submit" className="w-full" isLoading={loginMutation.isPending}>
            Se connecter
          </Button>
        </div>
      </form>
    </div>
  )
}
