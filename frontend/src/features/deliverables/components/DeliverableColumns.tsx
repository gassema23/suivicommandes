import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { momentFr } from "@/lib/momentFr";
import DataTableAction from "@/components/table/components/DataTableAction";
import { DataTableColumnHeader } from "@/components/table/components/DataTableColumnHeader";
import type { Deliverable } from "../types/deliverable.type";

momentFr();

export const deliverableColumns: ColumnDef<Deliverable>[] = [
  {
    accessorKey: "deliverableName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Livrable" />
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
          baseUrl="/pilotages/deliverables/update/$id"
          onDelete={row.original.onDelete}
          resource="deliverables"
        />
      );
    },
  },
];
