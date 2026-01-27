"use client";
import React from "react";
import Link from "next/link";
import { user } from "next-auth";
import { usePathname } from "next/navigation";

import { TRoute } from "@/types";
import { cn } from "@/lib/utils";

type Props = {
    currentUser: user;
    route: TRoute;
};

const RouteItem = ({ currentUser, route }: Props) => {
    const { icon, name, path, allowedRole } = route;

    const pathname = usePathname();
    const isCurrentPath = pathname.startsWith(path);

    const authorized = () => allowedRole.includes(currentUser.role);

    if (!authorized()) return null;
    return (
        <Link
            href={path}
            className={cn(
                "duration-200 relative flex px-5 py-3 rounded-lg items-center gap-x-3 hover:bg-secondary text-foreground",
                isCurrentPath && "text-background bg-primary dark:text-white hover:bg-primary/90"
            )}
        >
            <span className={`w-fit h-fit ${isCurrentPath ? "text-accent": "text-accent-foreground"} `}>
                {icon}
            </span>
            <span className={`${isCurrentPath ? "text-accent":""}  font-semibold text-sm`}>{name}</span>
            <p className={`w-[3px] h-3 absolute right-3  ${isCurrentPath ? "block":"hidden"} dark:bg-green-900 bg-white  `}></p>
        </Link>
    );
};

export default RouteItem;
