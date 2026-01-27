import { useEffect } from "react";

import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

interface DataTableBasicPaginationProps<TData> {
    table: Table<TData>;
    className?: string;
    pageSize? : number;
}

export default function DataTableBasicPagination<TData>({
    table,
    className,
    pageSize=5
}: DataTableBasicPaginationProps<TData>) {
    
    useEffect(() => table.setPageSize(Number(pageSize)), [pageSize, table]);

    return (
        <div className={cn( "flex items-center justify-end py-4 space-x-2", className )}>
            <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
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
