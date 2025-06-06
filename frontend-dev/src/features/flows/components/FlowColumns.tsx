import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { momentFr } from "@/lib/momentFr";
import DataTableAction from "@/features/common/table/components/DataTableAction";
import { DataTableColumnHeader } from "@/features/common/table/components/DataTableColumnHeader";
import type { Flow } from "../types/flow.type";

momentFr();

export const flowColumns: ColumnDef<Flow>[] = [
  {
    accessorKey: "flowName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Flux de transmission" />
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
          baseUrl="/pilotages/flows/update/$id"
          onDelete={row.original.onDelete}
          resource="flows"
        />
      );
    },
  },
];
