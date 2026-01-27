"use client"
import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

const BackButton = () => {
   const router = useRouter();
   
   return (
      <>
         <Button onClick={() => router.back()} variant={"ghost"} className="text-[min(14px,3vw)]">
            <ArrowLeft className="size-4"></ArrowLeft>
            back
         </Button>
      </>
   );
};

export default BackButton;
