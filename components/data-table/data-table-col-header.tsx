import {
    ArrowDownIcon,
    ArrowUpIcon,
    ChevronsUpDown,
    EyeOff,
  } from "lucide-react"
  import { Column } from "@tanstack/react-table"
  
  import { cn } from "@/lib/utils"
  import { Button } from "@/components/ui/button"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  
  interface DataTableColHeaderProps<TData, TValue>
    extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>
    title: string
  }
  
  export function DataTableColHeader<TData, TValue>({
    column,
    title,
    className,
  }: DataTableColHeaderProps<TData, TValue>) {
    if (!column.getCanSort()) {
      return <div className={cn(className)}>{title}</div>
    }
  
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="-ml-3 h-8 data-[state=open]:bg-accent"
            >
              <span className="font-bold">{title}</span>
              {column.getIsSorted() === "desc" ? (
                <ArrowDownIcon className="w-4 h-4 ml-2" />
              ) : column.getIsSorted() === "asc" ? (
                <ArrowUpIcon className="w-4 h-4 ml-2" />
              ) : (
                <ChevronsUpDown className="w-4 h-4 ml-2" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="border-none shadow-2" align="start">
            <DropdownMenuItem className="px-2 gap-x-2" onClick={() => column.toggleSorting(false)}>
              <ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              Asc
            </DropdownMenuItem>
            <DropdownMenuItem className="px-2 gap-x-2" onClick={() => column.toggleSorting(true)}>
              <ArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              Desc
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="px-2 gap-x-2" onClick={() => column.toggleVisibility(false)}>
              <EyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              Hide
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }