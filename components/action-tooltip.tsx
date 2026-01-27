"use client";

import React from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface ActionTooltipProps {
    children: React.ReactNode;
    content : string | React.ReactNode;
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
}

const ActionTooltip = ({
    content,
    children,
    side,
    align,
}: ActionTooltipProps) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={50}>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent
                    className="p-4 text-sm border-0 text-foreground/80 bg-background/60 backdrop-blur-sm shadow-2"
                    side={side}
                    align={align}
                >
                    {content}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default ActionTooltip;
