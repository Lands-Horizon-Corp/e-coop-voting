"use client";
import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import InvalidPrompt from "@/components/invalid-prompt";
import LoadingSpinner from "@/components/loading-spinner";

import { useEvent } from "@/hooks/public-api-hooks/use-events-api";
import UserAvatar from "@/components/user-avatar";
import { useElection } from "@/hooks/public-api-hooks/use-election-api";

type Props = {
    params: { id: number };
};

const RegisteredPage = ({ params }: Props) => {
    const searchParams = useSearchParams();

    const pb = searchParams.get("pb");
    const fullName = searchParams.get("fullname");
    const picture = searchParams.get("picture");

    const { event, isLoading } = useEvent(params.id);
    const { data: election, isLoading: isLoadingElection } = useElection({
        eventId: (event?.election ? event.id : undefined) as number,
        showErrorMessage: event?.election ? true : false,
    });

    if (isLoading || isLoadingElection)
        return (
            <div className="flex flex-col items-center justify-center min-h-dvh">
                <LoadingSpinner />
            </div>
        );

    if (!event)
        return (
            <div className="flex flex-col items-center justify-center min-h-dvh">
                <InvalidPrompt message="Election was not found" />
            </div>
        );

    return (
        <div className="flex flex-col items-center w-full">
            <div className="w-full py-8 px-4  min-h-screen max-w-xl bg-background lg:max-w-2xl flex flex-col items-center space-y-9 justify-center">
                <div className="relative">
                    <img
                        alt="event cover image"
                        className="z-10 rounded-xl h-[60vh] dark:drop-shadow-sm dark:drop-shadow-foreground w-full object-cover"
                        src={event.coverImage as ""}
                    />
                    <div className="px-8 bg-gradient-to-t from-background to-transparent absolute w-full py-9 bottom-0 left-0  flex gap-y-4">
                        <div className="flex gap-x-4 items-center">
                            <div className="w-8 h-2 rounded-full bg-orange-500" />
                            <p className="text-xl md:text-3xl">{event.title}</p>
                        </div>
                    </div>
                </div>
                <div className="gap-y-4 flex flex-col items-center">
                    <CheckCircle
                        className="size-14 text-green-600"
                        strokeWidth={1}
                    />
                    <p className="text-2xl">You have been registered 🎉</p>

                    {pb && fullName && (
                        <div className="flex px-6 py-4 rounded-xl bg-secondary/25 w-full gap-y-2 flex-col items-center">
                            {picture && (
                                <UserAvatar
                                    className="size-16"
                                    src={picture}
                                    fallback=".."
                                />
                            )}
                            <p className="text-2xl lg:text-4xl"> {fullName} </p>
                            <p className="text-xl lg:text-2xl"> {pb} </p>
                            <p className="text-xl text-green-400 lg:text-2xl">
                                Registered
                            </p>
                        </div>
                    )}

                    <p className="text-foreground/70">
                        Your registration will serve as your attendance
                    </p>
                    <div className="flex gap-x-4 items-center justify-center">
                        <Link href={`/events/${event.id}`}>
                            <Button variant="secondary">Return to Event</Button>
                        </Link>
                        {election && (
                            <>
                                {election.status === "live" ? (
                                    <Link href={`/events/${event.id}/election`}>
                                        <Button className="bg-[#00C667] w-full ">
                                            Vote Now
                                        </Button>
                                    </Link>
                                ) : (
                                    <Button disabled variant="secondary">
                                        voting is not open
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisteredPage;
