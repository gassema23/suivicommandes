import LoadingPage from "@/components/ui/loader/LoadingPage";
import { DeleteModal } from "@/components/ui/quebec/DeleteModal";
import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { DataTable } from "@/components/table/DataTable";
import { requestTypeColumns } from "@/features/request-types/components/RequestTypeColumns";
import { getRequestTypes } from "@/features/request-types/services/get-request-types.service";
import type { RequestTypeResponse } from "@/features/request-types/types/request-type.type";
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

const requestTypesQueryOptions = (pageNumber: number) =>
  queryOptions<RequestTypeResponse>({
    queryKey: QUERY_KEYS.REQUEST_TYPES_WITH_PAGE(pageNumber),
    queryFn: () => getRequestTypes(pageNumber),
  });

export const Route = createFileRoute(
  "/_authenticated/pilotages/request-types/"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.REQUEST_TYPES.READ]),
  head: () => ({
    meta: [{ title: "Types de demande" }],
  }),
  validateSearch: (search) => ({
    page: Number(search.page ?? 1),
  }),
  loader: (args) => {
    const { context, search } = args as any;
    return context.queryClient.ensureQueryData(
      requestTypesQueryOptions(Number(search?.page ?? "1"))
    );
  },
  errorComponent: ({ error }) => <FormError message={error.message} />,
  staticData: {
    title: "Types de demande",
    action: "/pilotages/request-types/create",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      {
        label: "Types de demande",
        href: "/pilotages/request-types",
        isCurrent: true,
      },
    ],
  },
  pendingComponent: () => <LoadingPage />,
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { page = 1 } = Route.useSearch();
  const pageNumber = Number(page);

  const { data: requestTypes } = useSuspenseQuery<RequestTypeResponse>(
    requestTypesQueryOptions(pageNumber)
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const dataWithDelete = {
    ...requestTypes,
    data: (requestTypes.data ?? []).map((requestType) => ({
      ...requestType,
      onDelete: () => setDeleteId(requestType.id),
    })),
  };

  return (
    <>
      <DataTable
        data={dataWithDelete}
        columns={requestTypeColumns}
        currentPage={pageNumber}
        totalPages={requestTypes.meta.totalPages}
        onPageChange={(page) => navigate({ search: { page } })}
      />
      <DeleteModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        deleteUrl="request-types"
        deleteId={deleteId}
        onSuccess={() => {
          setDeleteId(null);
          toast.success(SUCCESS_MESSAGES.delete("Type de demande"));
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REQUEST_TYPES });
        }}
      />
    </>
  );
}
