import TwoFactorAuthForm from '@/features/auth/components/two-factor-auth-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_guest/(login)/two-factor')({
  component: RouteComponent,
})

function RouteComponent() {
  return <TwoFactorAuthForm />
}
