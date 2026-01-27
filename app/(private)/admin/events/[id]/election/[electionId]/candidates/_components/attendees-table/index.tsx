"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";
import DataTable from "@/components/data-table/data-table";
import DataTableViewOptions from "@/components/data-table/data-table-view-options";
import {
   getCoreRowModel,
   getFilteredRowModel,
   getPaginationRowModel,
   getSortedRowModel,
   useReactTable,
} from "@tanstack/react-table";
import SearchInput from "@/components/data-table/table-search-input";
import columns from "./column";
import DataTableBasicPagination2 from "@/components/data-table/data-table-basic-pagination-2";
import {   TMemberWithEventElectionId } from "@/types";

type Props = {
   data:TMemberWithEventElectionId[]
   setSelectedMembers: Dispatch<SetStateAction<TMemberWithEventElectionId | undefined>>
};

const EventAttendeesTable = ({ data,setSelectedMembers }: Props) => {
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
      enableMultiRowSelection:false,
      
   });
   const selectedCandidates = table.getSelectedRowModel().flatRows.map(({ original }) => original);

   useEffect(()=>{
      setSelectedMembers(selectedCandidates[0])
   },[table.getState()])

  
   return (
      <div className="flex flex-1 flex-col gap-y-2 max-h-[40vh] overflow-auto ">
         <div className="flex flex-wrap items-center justify-between p-3 rounded-xl gap-y-2 ">
            <div className="flex items-center gap-x-4 text-muted-foreground">
               <div className="relative">
                  <SearchIcon className="absolute text-muted-forground  w-4 h-auto top-3 left-2" />
                  <SearchInput
                     setGlobalFilter={(e) => setGlobalFilter(e)}
                     globalFilter={globalFilter}
                  ></SearchInput>
               </div>
            </div>
         </div>
         <DataTable
            className="flex-1 bg-background/50 rounded-"
            table={table}
         />
       
         <div className="">
            <DataTableBasicPagination2  table={table} />
         </div>
      </div>
   );
};

export default EventAttendeesTable;
