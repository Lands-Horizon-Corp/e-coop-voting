"use client";
import React, { useState } from "react";
import {
   getCoreRowModel,
   getFilteredRowModel,
   getPaginationRowModel,
   getSortedRowModel,
   useReactTable,
} from "@tanstack/react-table";
import { ColumnDef } from "@tanstack/react-table";

import { DataTableColHeader } from "@/components/data-table/data-table-col-header";
import { TPosition } from "@/types";
import DataTable from "@/components/data-table/data-table";
import DataTablePagination from "@/components/data-table/data-table-pagination";
import DataTableBasicPagination2 from "@/components/data-table/data-table-basic-pagination-2";


const columns: ColumnDef<TPosition>[] = [
     {
        accessorKey: "id",
        header: ({ column }) => <DataTableColHeader column={column} title="id" />,
        cell: ({ row }) => (
           <div className="font-medium uppercase">{row.original.id}</div>
        ),
        enableSorting: false,
        enableHiding: false,
     },
     {
        accessorKey: "positionName",
        header: ({ column }) => (
           <DataTableColHeader column={column} title="Position Name" />
        ),
        cell: ({ row }) => {
           return <div className=""> {row.original.positionName}</div>;
        },
     },
     {
        accessorKey: "numberOfSelection",
        header: ({ column }) => (
           <DataTableColHeader column={column} title="number of Seats" />
        ),
        cell: ({ row }) => (
           <div className=""> {row.original.numberOfSelection}</div>
        ),
     },
  ];

type Props = {
   data:TPosition[]
}

export const Positions = ({data}:Props) => {
     const [globalFilter, setGlobalFilter] = useState<string>("");

     const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
           globalFilter,
        },
        initialState: {
           pagination: { pageIndex: 0, pageSize: 20 },
        },
        onGlobalFilterChange: setGlobalFilter,
     });
  
     return (
        <div className="h-fit">
           <DataTable
              className="flex-1 bg-background/50 rounded-2xl"
           
              table={table}
           />
           <div className="lg:hidden">
           <DataTableBasicPagination2 table={table} />
           </div>
           <div className="hidden lg:block">
           <DataTablePagination pageSizes={[5,10,15]} table={table} />
           </div>
        </div>
     );
  };
  