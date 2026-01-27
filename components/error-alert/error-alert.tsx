import { cn } from "@/lib/utils";
import { X } from "lucide-react";

type TProps = {
    message: string;
    title: string;
    className? : string;
};

export const ErrorAlert = ({ className, message, title }: TProps) => {
    return (
        <div className={cn("px-4 py-3 flex max-w-sm mx-auto items-center gap-x-2 rounded-xl dark:bg-background/40 bg-background", className)}>
            <div className="flex items-center justify-center p-2 bg-secondary rounded-full">
                <X className="size-5 text-rose-400" />
            </div>
            <div className="space-y-2">
                <p className="font-medium text-foreground/80">{title}</p>
                <p className="text-sm text-rose-400">{message}</p>
            </div>
        </div>
    );
};

export default ErrorAlert;
