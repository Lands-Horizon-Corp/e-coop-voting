import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import { cn } from "@/lib/utils";

type Props = {
    className? : string,
    src : string,
    fallback : string,
};

const UserAvatar = ({ className, src, fallback}: Props) => {
    return (
        <Avatar className={cn("h-8 w-8", className)}>
            <AvatarImage className="object-cover" src={src} />
            <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
    );
};

export default UserAvatar;
