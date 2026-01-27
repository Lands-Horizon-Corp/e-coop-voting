"use client";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import MemberSearch from "@/components/member-search";
import MemberInfoDisplay from "../../../_components/member-info-display";

import RegisterAttendance from "./register-attendance";
import { TEventWithElection, TMemberAttendeesMinimalInfo } from "@/types";

type Props = {
    eventId: number;
    event: TEventWithElection;
};

const Attendance = ({ eventId, event }: Props) => {
    const [member, setMember] = useState<TMemberAttendeesMinimalInfo | null>(
        null
    );

    if (!member)
        return (
            <MemberSearch
                eventId={eventId}
                enableRecentMember={false}
                onFound={(member) => setMember(member)}
            />
        );

    return (
        <div className="flex flex-col px-8 gap-y-8 lg:gap-y-16 relative">
            <MemberInfoDisplay
                hideBirthday={event.requireBirthdayVerification}
                member={member}
            />
            <div className="flex px-2 flex-col items-center">
                {member.registered ? (
                    <Link className="mx-auto" href={`/events/${eventId}`}>
                        <Button>Go Back to Event</Button>
                    </Link>
                ) : (
                    <RegisterAttendance
                        event={event}
                        member={member}
                        onUnselect={() => setMember(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default Attendance;
