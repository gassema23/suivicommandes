import LoadingPage from '@/components/ui/loader/LoadingPage'
import FormError from '@/components/ui/shadcn/form-error'
import { createPermissionGuard } from '@/features/common/authorizations/helpers/createPermissionGuard'
import { PERMISSIONS } from '@/features/common/authorizations/types/auth.types'
import DelayTypeCreateForm from '@/features/delay-types/components/DelayTypeCreateForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/pilotages/delay-types/create',
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.DELAY_TYPES.CREATE]),
      head: () => ({
        meta: [{ title: "Ajouter un type de délai" }],
      }),
      component: RouteComponent,
      errorComponent: ({ error }) => (
        <FormError
          title="Erreur lors du chargement du type de délai"
          message={error.message}
        />
      ),
      staticData: {
        title: "Ajouter un type de délai",
        breadcrumb: [
          { label: "Tableau de bord", href: "/" },
          { label: "Types de délai", href: "/pilotages/delay-types" },
          {
            label: "Ajouter un type de délai",
            href: "/pilotages/delay-types/create",
            isCurrent: true,
          },
        ],
      },
      pendingComponent: () => <LoadingPage />,
})

function RouteComponent() {
  return <DelayTypeCreateForm />
}
