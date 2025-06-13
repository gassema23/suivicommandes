import LoadingPage from "@/components/ui/loader/LoadingPage";
import { DeleteModal } from "@/components/ui/quebec/DeleteModal";
import FormError from "@/components/ui/shadcn/form-error";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import { DataTable } from "@/components/table/DataTable";
import { conformityTypeColumns } from "@/features/conformity-types/components/ConformityTypeColumns";
import { getConformityTypes } from "@/features/conformity-types/services/get-conformity-types.service";
import type { ConformityTypeResponse } from "@/features/conformity-types/types/conformity-type.type";
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";

const conformityTypesQueryOptions = (pageNumber: number) =>
  queryOptions<ConformityTypeResponse>({
    queryKey: QUERY_KEYS.CONFORMITY_TYPES_WITH_PAGE(pageNumber),
    queryFn: () => getConformityTypes(pageNumber),
  });

export const Route = createFileRoute(
  '/_authenticated/pilotages/conformity-types/',
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.CONFORMITY_TYPES.READ]),
  head: () => ({
    meta: [{ title: "Types de conformité" }],
  }),
  validateSearch: (search) => ({
    page: Number(search.page ?? 1),
  }),
  loader: (args) => {
    const { context, search } = args as any;
    return context.queryClient.ensureQueryData(
      conformityTypesQueryOptions(Number(search?.page ?? "1"))
    );
  },
  errorComponent: ({ error }) => (
    <FormError
      title="Erreur lors du chargement des types de conformité"
      message={error.message}
    />
  ),
  staticData: {
    title: "Types de conformité",
    action: "/pilotages/conformity-types/create",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      {
        label: "Types de conformité",
        href: "/pilotages/conformity-types",
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

  const { data: conformityTypes } = useSuspenseQuery<ConformityTypeResponse>(
    conformityTypesQueryOptions(pageNumber)
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const dataWithDelete = {
    ...conformityTypes,
    data: (conformityTypes.data ?? []).map((conformityType) => ({
      ...conformityType,
      onDelete: () => setDeleteId(conformityType.id),
    })),
  };

  return (
    <>
      <DataTable
        data={dataWithDelete}
        columns={conformityTypeColumns}
        currentPage={pageNumber}
        totalPages={conformityTypes.meta.totalPages}
        onPageChange={(page) => navigate({ search: { page } })}
      />
      <DeleteModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        deleteUrl="conformity-types"
        deleteId={deleteId}
        onSuccess={() => {
          setDeleteId(null);
          toast.success(SUCCESS_MESSAGES.delete("Type de conformité"));
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONFORMITY_TYPES });
        }}
      />
    </>
  );
}