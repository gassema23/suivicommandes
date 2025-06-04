import LoadingPage from '@/components/ui/loader/LoadingPage'
import FormError from '@/components/ui/shadcn/form-error'
import { APP_NAME } from '@/config'
import { createPermissionGuard } from '@/features/common/authorizations/helpers/createPermissionGuard'
import { PERMISSIONS } from '@/features/common/authorizations/types/auth.types'
import ClientCreateForm from '@/features/clients/components/ClientCreateForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/pilotages/clients/create',
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.CLIENTS.CREATE]),
  head: () => ({
    meta: [{ title: "Ajouter un client" }],
  }),
  component: RouteComponent,
  errorComponent: ({ error }) => (
    <FormError
      title="Erreur lors du chargement du client"
      message={error.message}
    />
  ),
  staticData: {
    title: "Ajouter un client",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      { label: "Clients", href: "/pilotages/clients" },
      {
        label: "Ajouter un client",
        href: "/pilotages/clients/create",
        isCurrent: true,
      },
    ],
  },
  pendingComponent: () => <LoadingPage />,
})

function RouteComponent() {
  return <ClientCreateForm />
}
