import { cn } from "@/lib/utils";
import { ShieldAlert } from "lucide-react";
import React from "react";

type Props ={
  className?:string,
}

const NotAllowed = ({className}:Props) => {
   return (
      <div className={cn("w-full h-screen flex justify-center items-center", className)}>
            <div className="flex flex-col items-center gap-2">
               <ShieldAlert className=" text-muted-foreground w-12 h-auto" />
               You are not allowed to visit this page.
         </div>
      </div>
   );
};

export default NotAllowed;
