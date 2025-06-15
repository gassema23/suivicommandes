import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { momentFr } from "@/lib/momentFr";
import DataTableAction from "@/components/table/components/DataTableAction";
import { DataTableColumnHeader } from "@/components/table/components/DataTableColumnHeader";
import type { Holiday } from "../types/holiday.type";

momentFr();

type HolidayWithDelete = Holiday & { onDelete: () => void };

export const holidayColumns: ColumnDef<HolidayWithDelete>[] = [
  {
    accessorKey: "holidayName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Jour férié" />
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "holidayDate",
    cell: ({ getValue }) => {
      const date = getValue<string>();
      return moment(date).format("LL");
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date du jour férié" />
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
          baseUrl="/pilotages/holidays/update/$id"
          onDelete={row.original.onDelete}
          resource="holidays"
        />
      );
    },
  },
];
