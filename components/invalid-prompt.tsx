import { cn } from "@/lib/utils";

const InvalidPrompt = ({
    message = "invalid election",
    className
}: {
    message?: string;
    className? : string;
}) => {
    return (
        <div className={cn("flex flex-col py-20 px-5 gap-y-6 min-h-screen w-full items-center", className)}>
            <div className="flex-1 w-dvw flex flex-col items-center justify-center">
                <p className="text-center text-foreground/70">
                    {message}
                </p>
            </div>
        </div>
    );
};

export default InvalidPrompt;
