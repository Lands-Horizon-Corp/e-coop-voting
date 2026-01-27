import React, { useEffect } from "react";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

interface DataTableBasicPaginationProps<TData> {
    table: Table<TData>;
    className?: string;
    pageSize?: number;
    showPageNumber?: boolean;
}

export default function DataTableBasicPagination2<TData>({
    table,
    className,
    pageSize = 10,
    showPageNumber = true,
}: DataTableBasicPaginationProps<TData>) {
    
    useEffect(() => table.setPageSize(Number(pageSize)), [pageSize, table]);

    return (
        <div className={cn( "flex items-center justify-between py-4 space-x-2", className)}>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                {showPageNumber && (
                    <>
                        Page {table.getState().pagination.pageIndex + 1} of{" "}
                        {table.getPageCount()}
                    </>
                )}
            </div>
            <div className="space-x-2">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
