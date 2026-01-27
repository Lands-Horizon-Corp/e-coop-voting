import { cn } from "@/lib/utils";
import { Check, Copy, Send } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

type Props = { url : string, displayText? : string, className? : string, duration? : number };

const CopyURL = ( { url, displayText="Copy URL", className, duration = 3}: Props) => {
    const [coppied, setCoppied] = useState(false);

    const handleCopy = () => {
        if(coppied) return;
        try{
            navigator.clipboard.writeText(url)
            toast.success("Coppied")
            setCoppied(true)
            setTimeout(()=> setCoppied(false), duration * 1000 )
        }catch(e){
            toast.error("Sorry, Couldn't copy link")
        }
    }

    return (
        <div onClick={handleCopy} className={cn("flex gap-x-4 px-3 text-xs group duration-200 cursor-pointer text-foreground/70 hover:text-foreground py-2 bg-secondary rounded-xl ", className, coppied && "bg-green-300/20")}>
            <p>{displayText}</p>
            {
                coppied ? <Check className="size-4 text-green-700" strokeWidth={1} /> : <Copy className="h-4 w-4" strokeWidth={1} />
            }
        </div>
    );
};

export default CopyURL;
