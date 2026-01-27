"use client";
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export type TPublicNavItem = {
    routeName: string;
    path: string;
    Icon: React.ReactNode;
    disabled?: boolean;
};

const RouteItem = ({
    routeName,
    path,
    Icon,
    disabled = false,
}: TPublicNavItem) => {
    const pathName = usePathname();

    if (disabled) return null;

    return (
        <div className="relative rounded-xl group lg:rounded-full overflow-clip">
            <div className="absolute top-2 left-3 blur-md opacity-10 group-hover:opacity-60 z-0">
                {Icon}
            </div>
            <Link
                href={path}
                className={cn(
                    "duration-200 z-10 relative px-3 py-2 text-foreground bg-secondary/30 group-hover:bg-background/20 ease-in flex items-center gap-x-2",
                    pathName === path && "bg-secondary/80 dark:bg-secondary/80"
                )}
            >
                {Icon} {routeName}
            </Link>
        </div>
    );
};

export default RouteItem;
