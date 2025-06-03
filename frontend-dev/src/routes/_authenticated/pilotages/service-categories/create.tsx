import LoadingPage from '@/components/ui/loader/LoadingPage'
import FormError from '@/components/ui/shadcn/form-error'
import { APP_NAME } from '@/config'
import { createPermissionGuard } from '@/features/authorizations/helpers/createPermissionGuard'
import { PERMISSIONS } from '@/features/authorizations/types/auth.types'
import ServiceCategoryCreateForm from '@/features/service-categories/components/ServiceCategoryCreateForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/pilotages/service-categories/create',
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.SERVICES.CREATE]),
      head: () => ({
        meta: [{title: `Ajouter une catégorie de service | ${APP_NAME}`}],
      }),
      component: RouteComponent,
      errorComponent: ({ error }) => (
        <FormError
          title="Erreur lors du chargement de la catégorie de service"
          message={error.message}
        />
      ),
      staticData: {
        title: "Ajouter une catégorie de service",
        breadcrumb: [
          { label: "Tableau de bord", href: "/" },
          { label: "Catégories de services", href: "/pilotages/service-categories" },
          {
            label: "Ajouter une catégorie de service",
            href: "/pilotages/service-categories/create",
            isCurrent: true,
          },
        ],
      },
      pendingComponent: () => <LoadingPage />,
})

function RouteComponent() {
  return <ServiceCategoryCreateForm />
}
