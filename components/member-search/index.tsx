import z from "zod";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { MemberSearchMode } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";

import { Asterisk, CaseSensitive, Loader2 } from "lucide-react";

import QrReader from "@/components/qr-reader";
import { Input } from "@/components/ui/input";
import ActionTooltip from "../action-tooltip";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import MultiResultSelect from "./multi-result-select";
import ErrorAlert from "@/components/error-alert/error-alert";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import RecentMember from "./recent-member";

import { TMemberAttendeesMinimalInfo } from "@/types";
import { usePublicGetEventById } from "@/hooks/public-api-hooks/use-events-api";
import { useSearchMemberAttendee } from "@/hooks/public-api-hooks/use-member-api";
import { memberAttendeeSearchSchema } from "@/validation-schema/event-registration-voting";

type Props = {
    eventId: number;
    disableQr?: boolean;
    enableRecentMember?: boolean;
    reason?: z.infer<typeof memberAttendeeSearchSchema>["reason"];
    onFound: (member: TMemberAttendeesMinimalInfo) => void;
};

const anims = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
    },
};

const MemberSearch = ({
    eventId,
    disableQr = false,
    reason = "registration",
    enableRecentMember = true,
    onFound,
}: Props) => {
    const [searchMode, setSearchMode] =
        useState<MemberSearchMode>("ByPassbook");
    const { searchResults, searchMember, isPending, isError, error, reset } =
        useSearchMemberAttendee(eventId, onFound);

    usePublicGetEventById({
        eventId,
        onSuccess: (event) => {
            setSearchMode(event.defaultMemberSearchMode);
        },
    });

    const form = useForm<z.infer<typeof memberAttendeeSearchSchema>>({
        resolver: zodResolver(memberAttendeeSearchSchema),
        defaultValues: {
            passbookNumber: "",
            nameSearch: "",
        },
    });

    const disabled = isPending;

    if (searchResults)
        return (
            <div className="flex flex-col items-center gap-y-4">
                <MultiResultSelect onPick={onFound} results={searchResults} />
                <Button onClick={() => reset()}>Search Again</Button>
            </div>
        );

    return (
        <motion.div
            initial="hidden"
            variants={anims}
            animate="visible"
            className="flex flex-col items-center gap-y-4"
        >
            {enableRecentMember && (
                <RecentMember
                    reason={reason}
                    eventId={eventId}
                    onSelect={(member) => onFound(member)}
                />
            )}
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit((pbForm) =>
                        searchMember(pbForm)
                    )}
                    className="flex flex-col items-center gap-y-4"
                >
                    <div className="relative">
                        {searchMode === "ByPassbook" && (
                            <FormField
                                key="passbook search"
                                control={form.control}
                                name="passbookNumber"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <Input
                                                disabled={disabled}
                                                key="passbook search input"
                                                placeholder="Enter Passbook Number"
                                                className="text-2xl px-4 py-6 text-center font-medium placeholder:font-normal placeholder:text-base placeholder:text-foreground/30"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        {searchMode === "ByName" && (
                            <FormField
                                key="name search"
                                control={form.control}
                                name="nameSearch"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <Input
                                                disabled={disabled}
                                                key="name search input"
                                                placeholder="Enter last name &amp; first name"
                                                className="text-2xl px-4 py-6 text-center font-medium placeholder:font-normal placeholder:text-base placeholder:text-foreground/30"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <ActionTooltip
                            side="top"
                            align="center"
                            content="Change search mode"
                        >
                            <div
                                className="rounded-lg text-white/70 dark:hover:text-foreground hover:text-white dark:text-foreground/60 absolute top-2 right-2 backdrop-blur-sm p-1 group bg-stone-700/60 group hover:bg-stone-700 cursor-pointer duration-150 ease-in"
                                onClick={(e) => {
                                    e.preventDefault();
                                    form.reset();
                                    setSearchMode(
                                        searchMode === "ByPassbook"
                                            ? "ByName"
                                            : "ByPassbook"
                                    );
                                }}
                            >
                                {searchMode === "ByPassbook" && (
                                    <Asterisk
                                        className="size-6"
                                        strokeWidth={2}
                                    />
                                )}
                                {searchMode === "ByName" && (
                                    <CaseSensitive
                                        className="size-6"
                                        strokeWidth={2}
                                    />
                                )}
                            </div>
                        </ActionTooltip>
                    </div>
                    {searchMode === "ByName" && (
                        <>
                            <FormDescription className="text-sm text-foreground/80 text-center">
                                Please separate your last name and first name
                                with a comma and space
                            </FormDescription>
                            <FormDescription className="font-medium text-foreground/40">
                                Ex: Gonzales, John Christian
                            </FormDescription>
                        </>
                    )}
                    {searchMode === "ByPassbook" && (
                        <FormDescription className="text-sm text-center">
                            Enter your valid passbook number
                        </FormDescription>
                    )}
                    {!isPending && isError && error && (
                        <ErrorAlert
                            className="w-full"
                            title="Something went wrong"
                            message={error}
                        />
                    )}
                    <Button disabled={disabled} className="w-full">
                        {isPending ? (
                            <Loader2
                                className="h-3 w-3 animate-spin"
                                strokeWidth={1}
                            />
                        ) : (
                            "Find"
                        )}
                    </Button>
                    {!disableQr && (
                        <>
                            <div className="flex items-center justify-center w-full overflow-clip gap-x-4">
                                <Separator className="w-1/2" /> or{" "}
                                <Separator className="w-1/2" />
                            </div>
                            <QrReader
                                onScan={(qrCodes) => {
                                    if (qrCodes.length === 0) return;

                                    const { rawValue } = qrCodes[0];

                                    form.setValue("passbookNumber", rawValue);
                                    searchMember({
                                        passbookNumber: rawValue,
                                        nameSearch: "",
                                        reason,
                                    });
                                }}
                                components={{
                                    zoom: true,
                                    torch: true,
                                    finder: true,
                                }}
                                classNames={{
                                    container:
                                        "size-full sm:size-[400px] bg-background overflow-clip rounded-xl",
                                }}
                            />
                        </>
                    )}
                </form>
            </Form>
        </motion.div>
    );
};

export default MemberSearch;
