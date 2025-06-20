import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { momentFr } from "@/lib/momentFr";
import DataTableAction from "@/components/table/components/DataTableAction";
import { DataTableColumnHeader } from "@/components/table/components/DataTableColumnHeader";
import type { Flow } from "../../../shared/flow/types/flow.type";

momentFr();

type FlowWithDelete = Flow & { onDelete: () => void };

export const flowColumns: ColumnDef<FlowWithDelete>[] = [
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
