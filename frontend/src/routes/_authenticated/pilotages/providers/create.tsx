import LoadingPage from '@/components/ui/loader/LoadingPage'
import FormError from '@/components/ui/shadcn/form-error'
import { createPermissionGuard } from '@/shared/authorizations/helpers/createPermissionGuard'
import { PERMISSIONS } from '@/shared/authorizations/types/auth.types'
import ProviderCreateForm from '@/features/providers/components/ProviderCreateForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/pilotages/providers/create',
)({
   beforeLoad: createPermissionGuard([PERMISSIONS.PROVIDERS.CREATE]),
    head: () => ({
      meta: [{ title: "Ajouter un fournisseur" }],
    }),
    component: RouteComponent,
    errorComponent: ({ error }) => (
      <FormError
        title="Erreur lors du chargement du fournisseur"
        message={error.message}
      />
    ),
    staticData: {
      title: "Ajouter un fournisseur",
      breadcrumb: [
        { label: "Tableau de bord", href: "/" },
        { label: "Fournisseurs", href: "/pilotages/providers" },
        {
          label: "Ajouter un fournisseur",
          href: "/pilotages/providers/create",
          isCurrent: true,
        },
      ],
    },
    pendingComponent: () => <LoadingPage />,
})

function RouteComponent() {
  return <ProviderCreateForm />
}
