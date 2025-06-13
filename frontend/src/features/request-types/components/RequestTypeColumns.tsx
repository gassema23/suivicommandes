import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { momentFr } from "@/lib/momentFr";
import DataTableAction from "@/components/table/components/DataTableAction";
import { DataTableColumnHeader } from "@/components/table/components/DataTableColumnHeader";
import type { RequestType } from "@/shared/request-types/types/request-type.type";

momentFr();

export const requestTypeColumns: ColumnDef<RequestType>[] = [
  {
    accessorKey: "requestTypeName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type de Demande" />
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "updatedAt",
    header: "Dernière modification",
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ getValue }) => {
      return moment(getValue<string>()).fromNow();
    },
  },
  {
    id: "id",
    accessorKey: "id",
    header: "",
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ row }) => {
      return (
        <DataTableAction
          id={row.original.id}
          baseUrl="/pilotages/request-types/update/$id"
          onDelete={row.original.onDelete}
          resource="request_types"
        />
      );
    },
  },
];
