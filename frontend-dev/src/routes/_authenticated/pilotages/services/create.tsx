import LoadingPage from '@/components/ui/loader/LoadingPage'
import FormError from '@/components/ui/shadcn/form-error'
import { APP_NAME } from '@/config'
import { createPermissionGuard } from '@/features/authorizations/helpers/createPermissionGuard'
import { PERMISSIONS } from '@/features/authorizations/types/auth.types'
import ServiceCreateForm from '@/features/services/components/ServiceCreateForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/pilotages/services/create',
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.SERVICES.CREATE]),
    head: () => ({
      meta: [
        {
          name: "description",
          content: "",
        },
        {
          title: `Ajouter un service | ${APP_NAME}`,
        },
      ],
    }),
    component: RouteComponent,
    errorComponent: ({ error }) => (
      <FormError
        title="Erreur lors du chargement des services"
        message={error.message}
      />
    ),
    staticData: {
      title: "Ajouter un service",
      breadcrumb: [
        { label: "Tableau de bord", href: "/" },
        { label: "Services", href: "/pilotages/services" },
        {
          label: "Ajouter un service",
          href: "/pilotages/services/create",
          isCurrent: true,
        },
      ],
    },
    pendingComponent: () => <LoadingPage />,
})

function RouteComponent() {
  return <ServiceCreateForm />
}
