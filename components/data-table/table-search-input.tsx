import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

interface Props {
    className? : string,
  globalFilter:string,
  setGlobalFilter:React.Dispatch<React.SetStateAction<string>>;
}

const SearchInput = ({globalFilter,setGlobalFilter, className}: Props) => {
     const onFocusSearch = useRef<HTMLInputElement | null>(null);
     useEffect(() => {
        const shortCutCommand = (event: KeyboardEvent) => {
           if (
              (event.ctrlKey && event.key === "k") ||
              (event.altKey && event.key === "k") ||
              (event.metaKey && event.key === "k")
           ) {
              event.preventDefault();
              onFocusSearch.current?.focus();
           }
        };
        window.addEventListener("keydown", shortCutCommand);
        return () => {
           window.removeEventListener("keydown", shortCutCommand);
        };
     }, []);
   return (
      <Input
         ref={onFocusSearch}
         placeholder="Search..."
         value={globalFilter}
         onChange={(event) => setGlobalFilter(event.target.value)}
         className={cn("w-full pl-8 border-t-0 border-l-0 border-r-0 border-muted-foreground placeholder:text-black/50 dark:placeholder:text-white/50 text-muted-foreground  dark:border-white/40 bg-transparent dark:text-white  text-sm md:text-base ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0", className)}
      />
   );
};

export default SearchInput;
