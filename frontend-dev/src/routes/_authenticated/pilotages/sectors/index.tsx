import LoadingPage from "@/components/ui/loader/LoadingPage";
import { DeleteModal } from "@/components/ui/quebec/DeleteModal";
import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/features/common/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/features/common/authorizations/types/auth.types";
import { SectorColumns } from "@/features/sectors/components/SectorColumns";
import { DataTable } from "@/features/common/table/DataTable";
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { getSectors } from "@/features/sectors/services/get-sectors.service";
import type { SectorsResponse } from "@/features/sectors/types/sector.type";
import { QUERY_KEYS } from "@/config/query-key";

const sectorsQueryOptions = queryOptions<SectorsResponse>({
  queryKey: QUERY_KEYS.SECTORS,
  queryFn: () => getSectors(),
});

export const Route = createFileRoute("/_authenticated/pilotages/sectors/")({
  beforeLoad: createPermissionGuard([PERMISSIONS.SECTORS.READ]),
  head: () => ({
    meta: [{ title: "Secteurs" }],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(sectorsQueryOptions),
  errorComponent: ({ error }) => (
    <FormError
      title="Erreur lors du chargement des secteurs"
      message={error.message}
    />
  ),
  staticData: {
    title: "Secteurs",
    action: "/pilotages/sectors/create",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      { label: "Secteurs", href: "/pilotages/sectors", isCurrent: true },
    ],
  },
  pendingComponent: () => <LoadingPage />,
  component: RouteComponent,
});

function RouteComponent() {
  const { data: sectors } =
    useSuspenseQuery<SectorsResponse>(sectorsQueryOptions);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const dataWithDelete = {
    ...sectors,
    data: (sectors.data ?? []).map((sector) => ({
      ...sector,
      onDelete: () => setDeleteId(sector.id),
    })),
  };

  console.log("dataWithDelete", sectors);

  return (
    <>
      <DataTable data={dataWithDelete} columns={SectorColumns} />
      <DeleteModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        deleteUrl="sectors"
        deleteId={deleteId}
        onSuccess={() => {
          setDeleteId(null);
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SECTORS });
        }}
      />
    </>
  );
}
