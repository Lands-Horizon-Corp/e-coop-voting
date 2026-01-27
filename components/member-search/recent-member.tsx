import z from "zod";
import React from "react";

import { Button } from "../ui/button";
import UserAvatar from "../user-avatar";
import { Separator } from "../ui/separator";

import { TMemberAttendeesMinimalInfo } from "@/types";
import { useRecentMember } from "@/hooks/public-api-hooks/use-member-api";
import { memberAttendeeSearchSchema } from "@/validation-schema/event-registration-voting";

type Props = {
    eventId: number;
    reason?: z.infer<typeof memberAttendeeSearchSchema>["reason"];
    onSelect: (member: TMemberAttendeesMinimalInfo) => void;
};

const RecentMember = ({
    eventId,
    reason = "registration",
    onSelect,
}: Props) => {
    const { member, isLoading } = useRecentMember(eventId, reason);

    if (!member || isLoading) return null;

    return (
        <div className="flex w-full flex-col items-center gap-y-4">
            <p className="text-center text-sm">Recent Member</p>
            <div
                onClick={() => onSelect(member)}
                className="cursor-pointer group flex px-3 py-2 items-center w-full gap-x-2 duration-100 ease-in rounded-xl bg-secondary/70 hover:bg-secondary"
            >
                <div className="flex-1 flex items-center gap-x-2">
                    <UserAvatar
                        src={member.picture as ""}
                        fallback={`${member.firstName.charAt(0)} ${member.lastName.charAt(0)}`}
                        className="size-12"
                    />
                    <div className="flex flex-col">
                        <p>{`${member.firstName} ${member.lastName}`}</p>
                        <p className="text-sm inline-flex">
                            <span className="text-foreground/60">
                                Passbook :&nbsp;
                            </span>
                            <span>{member.passbookNumber}</span>
                        </p>
                    </div>
                </div>
                <Button
                    size="sm"
                    className="opacity-10 ease-in bg-transparent text-foreground hover:bg-transparent group-hover:opacity-100"
                >
                    continue as {member.firstName}
                </Button>
            </div>

            <div className="flex items-center justify-center w-full overflow-clip gap-x-4">
                <Separator className="w-full" />
            </div>
        </div>
    );
};

export default RecentMember;
