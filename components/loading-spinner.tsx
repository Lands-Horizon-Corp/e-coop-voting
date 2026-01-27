import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

type Props = {
    className? : string,
    strokeWidth? : number
}

const LoadingSpinner = ({ className, strokeWidth } : Props) => {
    return <Loader2 className={cn("size-4 animate-spin text-foreground/70", className)} strokeWidth={strokeWidth} />
}

export default LoadingSpinner;
