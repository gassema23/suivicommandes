import LoadingPage from "@/components/ui/loader/LoadingPage";
import { DeleteModal } from "@/components/ui/quebec/DeleteModal";
import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import { ServiceColumns } from "@/features/services/components/ServiceColumns";
import { getServices } from "@/features/services/services/get-services.service";
import { DataTable } from "@/components/table/DataTable";
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { ServiceResponse } from "@/features/services/types/service.type";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { toast } from "sonner";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";

const servicesQueryOptions = (pageNumber: number) =>
  queryOptions<ServiceResponse>({
    queryKey: QUERY_KEYS.SERVICES_WITH_PAGE(pageNumber),
    queryFn: () => getServices(pageNumber),
  });

export const Route = createFileRoute("/_authenticated/pilotages/services/")({
  beforeLoad: createPermissionGuard([PERMISSIONS.SERVICES.READ]),
  head: () => ({
    meta: [{ title: "Services" }],
  }),
  validateSearch: (search) => ({
    page: Number(search.page ?? 1),
  }),
  loader: (args) => {
    const { context, search } = args as any;
    return context.queryClient.ensureQueryData(
      servicesQueryOptions(Number(search?.page ?? "1"))
    );
  },
  errorComponent: ({ error }) => (
    <FormError
      title="Erreur lors du chargement des services"
      message={error.message}
    />
  ),
  staticData: {
    title: "Services",
    action: "/pilotages/services/create",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      { label: "Services", href: "/pilotages/services", isCurrent: true },
    ],
  },
  pendingComponent: () => <LoadingPage />,
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { page = 1 } = Route.useSearch();
  const pageNumber = Number(page);

  const { data: services } = useSuspenseQuery<ServiceResponse>(
    servicesQueryOptions(pageNumber)
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const dataWithDelete = {
    ...services,
    data: (services.data ?? []).map((service) => ({
      ...service,
      onDelete: () => setDeleteId(service.id),
    })),
  };

  return (
    <>
      <DataTable
        data={dataWithDelete}
        columns={ServiceColumns}
        currentPage={pageNumber}
        totalPages={services.meta.totalPages}
        onPageChange={(page) => navigate({ search: { page } })}
      />
      <DeleteModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        deleteUrl={`services/${deleteId}`}
        deleteId={deleteId}
        onSuccess={() => {
          setDeleteId(null);
          toast.success(SUCCESS_MESSAGES.delete("Service"));
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SERVICES });
        }}
      />
    </>
  );
}
