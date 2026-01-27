"use client";
import Link from "next/link";
import React, { useMemo } from "react";
import { Gift, Home, Menu, NotebookPen, QrCode, Vote } from "lucide-react";

import RouteItem from "./route-item";
import {
    Sheet,
    SheetTitle,
    SheetHeader,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { useGetEventById } from "@/hooks/api-hooks/use-events";
import { TEventWithElection } from "@/types";

type Props = {
    eventId: number;
};

const getNavigationItems = (eventId: number) => {
    const eventsNavRoutes = [
        {
            routeName: "Event",
            path: `/events/${eventId}`,
            disabled: (event: TEventWithElection | undefined) => {
                if (!event) return true;
                return false;
            },
            Icon: (
                <div className="p-1 bg-sky-400 text-white rounded-lg">
                    <Home className="size-4" />
                </div>
            ),
        },
        {
            routeName: "Register",
            path: `/events/${eventId}/register`,
            disabled: (event: TEventWithElection | undefined) => {
                if (!event) return true;
                return false;
            },
            Icon: (
                <div className="p-1 bg-teal-600 text-white rounded-lg">
                    <NotebookPen className="size-4" />
                </div>
            ),
        },
        {
            routeName: "Vote",
            path: `/events/${eventId}/election`,
            disabled: (event: TEventWithElection | undefined) => {
                if (!event) return true;
                return event.category !== "election";
            },
            Icon: (
                <div className="p-1 bg-orange-400 text-white rounded-lg">
                    <Vote className="size-4" />
                </div>
            ),
        },
        {
            routeName: "Claim",
            path: `/events/${eventId}/claim`,
            disabled: (event: TEventWithElection | undefined) => {
                if (!event) return true;
                return false;
            },
            Icon: (
                <div className="p-1 bg-indigo-400 text-white rounded-lg">
                    <Gift className="size-4" />
                </div>
            ),
        },
        {
            routeName: "QR Gen",
            path: `/events/${eventId}/qr-generator`,
            disabled: (event: TEventWithElection | undefined) => {
                return false;
            },
            Icon: (
                <div className="p-1 bg-gray-400 dark:bg-white text-gray-50 dark:text-gray-800 rounded-lg">
                    <QrCode className="size-4" />
                </div>
            ),
        },
    ];

    return eventsNavRoutes;
};

const EventsNav = ({ eventId }: Props) => {
    const { data: event } = useGetEventById({ eventId });

    const NavItems = useMemo(() => getNavigationItems(eventId), []);

    return (
        <header className="fixed top-0 z-50 flex flex-col items-center w-[100vw] px-4 py-2 lg:p-4 bg-white/20 dark:bg-slate-900/20 backdrop-blur-md">
            <div className="flex items-center justify-between w-full max-w-7xl">
                <Link
                    href="/"
                    className="text-sm lg:text-lg font-medium inline-flex items-center"
                >
                    <span className="text-xs lg:text-lg">e</span>Coop ACE &nbsp;
                    <span className="hidden md:block">System</span>
                </Link>
                <div className="lg:flex hidden items-center text-foreground/60 gap-y-2 md:gap-x-5 justify-center">
                    {NavItems.map((route) => (
                        <RouteItem
                            key={route.path}
                            {...route}
                            disabled={route.disabled(event)}
                        />
                    ))}
                </div>
                <div className="flex gap-x-4 items-center justify-end">
                    <ModeToggle />
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                className="block lg:hidden"
                                size="icon"
                                variant="ghost"
                            >
                                <Menu className="size-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="border-none bg-background/80 backdrop-blur-md">
                            <SheetHeader>
                                <SheetTitle>eCoop ACE System</SheetTitle>
                            </SheetHeader>
                            <div className="flex h-full flex-col py-4 px-1">
                                <div className="flex flex-1 flex-col gap-y-4">
                                    {NavItems.map((route) => (
                                        <RouteItem
                                            key={route.path}
                                            {...route}
                                            disabled={route.disabled(event)}
                                        />
                                    ))}
                                </div>
                                <p className="text-sm text-foreground/40 text-center">
                                    eCoop ACE System 2024
                                </p>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
};

export default EventsNav;
