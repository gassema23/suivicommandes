import LoadingPage from '@/components/ui/loader/LoadingPage';
import { DeleteModal } from '@/components/ui/quebec/DeleteModal';
import FormError from '@/components/ui/shadcn/form-error';
import { createPermissionGuard } from '@/shared/authorizations/helpers/createPermissionGuard';
import { PERMISSIONS } from '@/shared/authorizations/types/auth.types';
import { SUCCESS_MESSAGES } from '@/constants/messages.constant';
import { QUERY_KEYS } from '@/constants/query-key.constant';
import { DataTable } from '@/components/table/DataTable';
import { requestTypeServiceCategoryColumns } from '@/features/request-type-service-categories/components/RequestTypeServiceCategoryColumns';
import { getRequestTypeServiceCategories } from '@/features/request-type-service-categories/services/get-request-type-service-categories.service';
import type { RequestTypeServiceCategoryResponse } from '@/features/request-type-service-categories/types/request-type-service-category.type';
import { queryOptions, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import { toast } from 'sonner';

const requestTypeServiceCategoriesQueryOptions = (pageNumber: number) =>
  queryOptions<RequestTypeServiceCategoryResponse>({
    queryKey: QUERY_KEYS.REQUEST_TYPE_SERVICE_CATEGORIES_WITH_PAGE(pageNumber),
    queryFn: () => getRequestTypeServiceCategories(pageNumber),
  });


export const Route = createFileRoute(
  '/_authenticated/pilotages/request-type-service-categories/',
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.REQUEST_TYPE_SERVICE_CATEGORIES.READ]),
    head: () => ({
      meta: [{ title: "Catégories de services par type de demande" }],
    }),
    validateSearch: (search) => ({
      page: Number(search.page ?? 1),
    }),
    loader: (args) => {
      const { context, search } = args as any;
      return context.queryClient.ensureQueryData(
        requestTypeServiceCategoriesQueryOptions(Number(search?.page ?? "1"))
      );
    },
    errorComponent: ({ error }) => (
      <FormError
        title="Erreur lors du chargement des livrables"
        message={error.message}
      />
    ),
    staticData: {
      title: "Catégories de services par type de demande",
      action: "/pilotages/request-type-service-categories/create",
      breadcrumb: [
        { label: "Tableau de bord", href: "/" },
        {
          label: "Catégories de services par type de demande",
          href: "/pilotages/request-type-service-categories",
          isCurrent: true,
        },
      ],
    },
    pendingComponent: () => <LoadingPage />,
    component: RouteComponent,
  }
);

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { page = 1 } = Route.useSearch();
  const pageNumber = Number(page);

  const { data: requestTypeServiceCategories } = useSuspenseQuery<RequestTypeServiceCategoryResponse>(
    requestTypeServiceCategoriesQueryOptions(pageNumber)
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const dataWithDelete = {
    ...requestTypeServiceCategories,
    data: (requestTypeServiceCategories.data ?? []).map((requestTypeServiceCategory) => ({
      ...requestTypeServiceCategory,
      onDelete: () => setDeleteId(requestTypeServiceCategory.id),
    })),
  };

  return (
    <>
      <DataTable
        data={dataWithDelete}
        columns={requestTypeServiceCategoryColumns}
        currentPage={pageNumber}
        totalPages={requestTypeServiceCategories.meta.totalPages}
        onPageChange={(page) => navigate({ search: { page } })}
      />
      <DeleteModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        deleteUrl="request-type-service-categories"
        deleteId={deleteId}
        onSuccess={() => {
          setDeleteId(null);
          toast.success(SUCCESS_MESSAGES.delete("Catégories de services par type de demande"));
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.REQUEST_TYPE_SERVICE_CATEGORIES,
          });
        }}
      />
    </>
  );
}
