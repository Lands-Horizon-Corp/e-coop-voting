import React from "react";
import { user } from "next-auth";

import { FaHandsHoldingCircle } from "react-icons/fa6";
import { GitBranch, PartyPopper, User } from "lucide-react";

import { TRoute } from "@/types";
import RouteItem from "./route-item";

export const AdminRoutes: TRoute[] = [
    {
        icon: <FaHandsHoldingCircle className="size-5" />,
        name: "Coops",
        path: "/admin/coops",
        allowedRole: ["root"] 

    },
    {
        icon: <GitBranch className="size-5" />,
        name: "Branches",
        path: "/admin/branches",
        allowedRole: ["root", "coop_root"] 
    },
    {
        icon: <User className="size-5" />,
        name: "Users",
        path: "/admin/user-management",
        allowedRole: ["root", "coop_root", "admin"],
    },
    {
        icon: <PartyPopper className="w-5 h-5"/>,
        name: "Events",
        path: "/admin/events",
        allowedRole: ["root", "coop_root", "admin", "staff"],
    }
];

type Props = {
    currentUser: user;
};

const SideBarRoute = ({ currentUser }: Props) => {
    return (
            <div className="flex-1 flex flex-col gap-y-2 px-2 w-full">
            {AdminRoutes.map((route, i) => (
                <RouteItem currentUser={currentUser} route={route} key={i} />
            ))}
            {
                AdminRoutes.length === 0 && <p className="text-center">You role doesnt have page access</p>
            }
        </div>
    );
};

export default SideBarRoute;
