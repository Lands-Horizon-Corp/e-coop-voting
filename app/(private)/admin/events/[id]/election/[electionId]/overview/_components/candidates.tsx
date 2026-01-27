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
import {TCandidatewithPosition } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DataTable from "@/components/data-table/data-table";
import DataTablePagination from "@/components/data-table/data-table-pagination";
import DataTableBasicPagination2 from "@/components/data-table/data-table-basic-pagination-2";
import { getUniquePosition } from "@/hooks/api-hooks/position-api-hooks";

export const columns: ColumnDef<TCandidatewithPosition>[] = [
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
      accessorKey: "firstName",
      header: ({ column }) => (
         <DataTableColHeader column={column} title="FirstName" />
      ),
      cell: ({ row }) => {
         const img =
            row.original.picture === null
               ? "/images/default.png"
               : row.original.picture;
         return (
            <div className="flex items-center space-x-2">
               <Avatar>
                  <AvatarImage src={img} />
                  <AvatarFallback className="bg-primary text-accent">{row.original.firstName.charAt(0).toUpperCase()}</AvatarFallback>
               </Avatar>
              <h1 className="font-medium">  {row.original.firstName}</h1>
            </div>
         );
      },
      enableSorting: false,
      enableHiding: false,
   },
   {
      accessorKey: "lastName",
      header: ({ column }) => (
         <DataTableColHeader column={column} title="LastName" />
      ),
      cell: ({ row }) => <div className=""> {row.original.lastName}</div>,
      enableSorting: false,
      enableHiding: false,
   },
   {
      accessorKey: "passbookNumber",
      header: ({ column }) => (
         <DataTableColHeader column={column} title="passbook No." />
      ),
      cell: ({ row }) => <div className=""> {row.original.passbookNumber}</div>,
      enableSorting: false,
      enableHiding: false,
   },
   {
      accessorKey: "position",
      header: ({ column }) => (
         <DataTableColHeader column={column} title="position" />
      ),
      cell: ({ row }) => {
         return (
            <div className=""> {row.original.position?.positionName}</div>
         )
      },
      enableSorting: false,
      enableHiding: false,
   },
];

type Props={ 
   data:TCandidatewithPosition[]
}

export const Candidates = ({data}:Props) => {


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
