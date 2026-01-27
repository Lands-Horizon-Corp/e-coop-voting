"use client";
import React from "react";
import { BarChart2, Gift, HandCoins, UserCheck } from "lucide-react";
import NavItem from "./nav-item";

type Props = { eventId: number };

const incentiveRoutes = [
    {
        name: "Incentives",
        path: "incentives",
        Icon: (
            <div className="p-1 bg-teal-600 text-white rounded-lg">
                <Gift className="size-4" />
            </div>
        ),
    },
    {
        name: "Assignees",
        path: "assign",
        Icon: (
            <div className="p-1 bg-blue-400 text-white rounded-lg">
                <UserCheck className="size-4" />
            </div>
        ),
    },
    {
        name: "Claims Masterlist",
        path: "claims-list",
        Icon: (
            <div className="p-1 bg-orange-400 text-white rounded-lg">
                <HandCoins className="size-4" />
            </div>
        ),
    },
    {
        name: "Claim Reports",
        path: "reports",
        Icon: (
            <div className="p-1 bg-rose-400 text-white rounded-lg">
                <BarChart2 className="size-4" />
            </div>
        ),
    },
];

const IncentiveNavigation = ({ eventId }: Props) => {
    return (
        <div className="flex gap-x-2 p-4">
            {incentiveRoutes.map((route) => (
                <NavItem eventId={eventId} key={route.path} {...route} />
            ))}
        </div>
    );
};

export default IncentiveNavigation;
