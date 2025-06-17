import { DeleteModal } from "@/components/ui/quebec/DeleteModal";
import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { DataTable } from "@/components/table/DataTable";
import { requestTypeDelayColumns } from "@/features/request-type-delays/components/RequestTypeDelayColumns";
import { getRequestTypeDelays } from "@/features/request-type-delays/services/get-request-type-delays.service";
import type { RequestTypeDelayResponse } from "@/features/request-type-delays/types/request-type-delay.type";
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import LoadingTable from "@/components/ui/loader/LoadingTable";

const requestTypeDelaysQueryOptions = (pageNumber: number) =>
  queryOptions<RequestTypeDelayResponse>({
    queryKey: QUERY_KEYS.REQUEST_TYPE_DELAY_WITH_PAGE(pageNumber),
    queryFn: () => getRequestTypeDelays(pageNumber),
  });

export const Route = createFileRoute(
  "/_authenticated/pilotages/request-type-delays/"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.REQUEST_TYPE_DELAYS.READ]),
  head: () => ({
    meta: [{ title: "Délai par type de demande" }],
  }),
  validateSearch: (search) => ({
    page: Number(search.page ?? 1),
  }),
  errorComponent: ({ error }) => <FormError message={error.message} />,
  staticData: {
    title: "Délai par type de demande",
    action: "/pilotages/request-type-delays/create",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      {
        label: "Délai par type de demande",
        href: "/pilotages/request-type-delays",
        isCurrent: true,
      },
    ],
  },
  pendingComponent: () => <LoadingTable rows={10} columns={4} />,
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { page = 1 } = Route.useSearch();
  const pageNumber = Number(page);

  const { data: requestTypeDelays } =
    useSuspenseQuery<RequestTypeDelayResponse>(
      requestTypeDelaysQueryOptions(pageNumber)
    );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const dataWithDelete = {
    ...requestTypeDelays,
    data: (requestTypeDelays.data ?? []).map((requestTypeDelay) => ({
      ...requestTypeDelay,
      onDelete: () => setDeleteId(requestTypeDelay.id),
    })),
  };
  return (
    <>
      <DataTable
        data={dataWithDelete}
        columns={requestTypeDelayColumns}
        currentPage={pageNumber}
        totalPages={requestTypeDelays.meta.totalPages}
        onPageChange={(page) => navigate({ search: { page } })}
      />
      <DeleteModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        deletePageName="request-type-delays"
        deleteId={deleteId}
        onSuccess={() => {
          setDeleteId(null);
          toast.success(SUCCESS_MESSAGES.delete("Délai par type de demande"));
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.REQUEST_TYPE_DELAYS,
          });
        }}
      />
    </>
  );
}
