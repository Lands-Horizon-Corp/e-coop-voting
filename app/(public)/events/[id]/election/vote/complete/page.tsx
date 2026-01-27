"use client";
import Link from "next/link";
import { toast } from "sonner";
import * as htmlToImage from "html-to-image";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

import { CheckIcon } from "lucide-react";
import { IoIosSave } from "react-icons/io";

import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/user-avatar";
import { Separator } from "@/components/ui/separator";
import InvalidPrompt from "@/components/invalid-prompt";
import LoadingSpinner from "@/components/loading-spinner";

import { TVoteCopyB64 } from "@/types";
import { useElection } from "@/hooks/public-api-hooks/use-election-api";

type Props = {
    params: { id: number };
};

const CompletePage = ({ params }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [saving, setSaving] = useState(false);

    const searchParams = useSearchParams();
    const { data: election, isLoading } = useElection({
        eventId : params.id,
        showErrorMessage: true,
    });

    const pb = searchParams.get("pb");
    const fullName = searchParams.get("fullname");
    const picture = searchParams.get("picture");

    const getVotes = (): TVoteCopyB64[] => {
        if (!searchParams) return [];

        const encodedVotes = searchParams.get("votes");

        if (!encodedVotes) return [];

        const myVotes: TVoteCopyB64[] = JSON.parse(atob(encodedVotes));

        return myVotes;
    };

    const downloadVoteSummary = (downloadName: string) => {
        if (!containerRef.current) return;

        setSaving(true);

        htmlToImage
            .toJpeg(containerRef.current, { quality: 0.95 })
            .then((dataUrl) => {
                var link = document.createElement("a");
                link.download = `${downloadName}.jpeg`;
                link.href = dataUrl;
                link.click();
                toast.success("Vote summary downloaded");
            })
            .catch((error) => {
                console.log("Can't download", error);
                toast.error("Could not download summary");
            })
            .finally(() => {
                setSaving(false);
            });
    };

    useEffect(() => {
        if (!searchParams) return;

        getVotes();
    }, [searchParams]);

    if (isLoading)
        return (
            <div className="flex flex-col items-center justify-center min-h-dvh">
                <LoadingSpinner />
            </div>
        );

    if (!election)
        return (
            <div className="flex flex-col items-center justify-center min-h-dvh">
                <InvalidPrompt message="Election was not found" />
            </div>
        );

    return (
        <div className="flex flex-col items-center min-h-dvh">
            <div className="w-full flex-1 bg-background px-8 gap-y-8 py-16 max-w-4xl flex flex-col items-center">
                <div className="relative overflow-clip w-full">
                    <img
                        className="object-cover w-full rounded-xl max-h-[350px] "
                        src={election.event.coverImage as ""}
                    />
                    <div className="absolute w-full flex items-center bottom-0 left-0 py-8 px-4 bg-gradient-to-t  from-background to-transparent">
                        <h1 className="text-4xl dark:text-[#e7e0fb]">
                            {election.event.title}
                        </h1>
                    </div>
                </div>

                <div className="rounded-full bg-secondary text-green-400 border border-green-500 p-4">
                    <CheckIcon className="size-5" />
                </div>

                <p className="text-lg">Thank you for voting 🥳</p>

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
                            {" "}
                            Voted{" "}
                        </p>
                    </div>
                )}

                <div
                    ref={containerRef}
                    className="p-4 w-full flex gap-y-8 flex-col bg-background items-center"
                >
                    {getVotes().length > 0 && pb && fullName && (
                        <>
                            <Separator />
                            <div className="flex w-full gap-y-6 flex-col items-center">
                                <p className="text-xl pb-4">
                                    Your Vote Summary
                                </p>
                                <div className="w-full text-sm text-foreground/70 flex flex-col">
                                    <div className="flex justify-between">
                                        <p>
                                            Voter :{" "}
                                            <span className="text-foreground">
                                                {fullName}
                                            </span>
                                        </p>
                                        <p>
                                            Event ID :{" "}
                                            <span className="text-foreground">
                                                {election.eventId}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p>
                                            Passbook No :{" "}
                                            <span className="text-foreground">
                                                {pb}
                                            </span>
                                        </p>
                                        <p>
                                            Election ID :{" "}
                                            <span className="text-foreground">
                                                {election.id}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                {getVotes().map(
                                    ({ positionName, votedCandidates }) => (
                                        <div
                                            key={positionName}
                                            className="w-full flex flex-col gap-y-4 px-6 py-4 rounded-xl bg-secondary/50 border dark:bg-secondary/25"
                                        >
                                            <div className="flex justify-between">
                                                <p className="font-medium">
                                                    {positionName}
                                                </p>
                                                <p className="text-sm text-foreground/50">
                                                    {votedCandidates.length}{" "}
                                                    vote
                                                    {votedCandidates.length > 1
                                                        ? "'s"
                                                        : ""}
                                                </p>
                                            </div>
                                            <div className="w-full flex flex-col gap-y-4">
                                                {votedCandidates.length ===
                                                    0 && (
                                                    <p className="text-xs text-center text-foreground/40">
                                                        no voted candidate
                                                    </p>
                                                )}
                                                {votedCandidates.map(
                                                    ({
                                                        id,
                                                        firstName,
                                                        lastName,
                                                        picture,
                                                    }) => (
                                                        <div
                                                            key={id}
                                                            className="flex gap-x-2 justify-center"
                                                        >
                                                            {/* <UserAvatar
                                                                className="size-8 rounded-md"
                                                                src={
                                                                    picture as ""
                                                                }
                                                                fallback={`${firstName.charAt(0)}${lastName.charAt(0)}`}
                                                            /> */}
                                                            <p className="text-base text-foreground/60">{`${firstName} ${lastName}`}</p>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </>
                    )}
                </div>
                {getVotes().length > 0 && fullName && pb && (
                    <>
                        <div className="flex flex-col items-center gap-y-3">
                            <Button
                                onClick={() =>
                                    downloadVoteSummary(
                                        `${fullName}-${pb}-vote-summary`
                                    )
                                }
                                variant="secondary"
                                className="gap-x-2"
                            >
                                {saving ? (
                                    <LoadingSpinner />
                                ) : (
                                    <>
                                        <IoIosSave className="size-4" />
                                        <span>Download Summary Copy</span>
                                    </>
                                )}
                            </Button>
                            <p className="text-xs text-center text-foreground/50">
                                If download doesn&apos;t work, please take a
                                photo/screenshot of the summary instead as your
                                own copy.
                            </p>
                        </div>
                    </>
                )}
                <p className="text-foreground/80 text-center">
                    Your vote has been saved
                </p>
                <Link className="" href={`/events/${election.eventId}`}>
                    <Button size="sm">Return to Event</Button>
                </Link>
            </div>
        </div>
    );
};

export default CompletePage;
