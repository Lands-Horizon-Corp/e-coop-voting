import React from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";

import UserAvatar from "@/components/user-avatar";

import { TMemberAttendeesMinimalInfo } from "@/types";

type Props = {
    hideBirthday?: boolean;
    member: TMemberAttendeesMinimalInfo;
};

const fadeInVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
    },
};

const MemberInfoDisplay = ({ member, hideBirthday = false }: Props) => {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
            className="flex flex-col items-center lg:flex-row lg:items-center gap-y-1 lg:gap-y-8 lg:gap-x-4"
        >
            <UserAvatar
                className="rounded-xl size-32 lg:size-72"
                src={member.picture ?? "/images/default-avatar.png"}
                fallback={member.firstName}
            />
            <div className="space-y-2 md:space-y-4 text-xl p-4 lg:text-4xl">
                <div className="flex flex-col gap-y-0.5 justify-center text-center">
                    <p className="border-b border-muted-foreground/40 dark:border-muted pb-2">
                        {`${member.firstName} ${member.middleName ?? ""} ${member.lastName}`}{" "}
                    </p>
                    <p className="text-xs text-muted-foreground">Name</p>
                </div>
                <div className="flex flex-col gap-y-0.5 justify-center text-center">
                    <p className="border-b border-muted-foreground/40 dark:border-muted pb-2">
                        {`${member.passbookNumber}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {" "}
                        PB.No / ID.No
                    </p>
                </div>
                {!hideBirthday && (
                    <div className="flex flex-col gap-y-0.5 justify-center text-center">
                        <p className="border-b border-muted-foreground/40 dark:border-muted pb-2">
                            {`${member.birthday ? format(member.birthday, "MMMM d, yyyy") : "No Birthdate"}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Birthdate
                        </p>
                    </div>
                )}
                <div className="flex items-center justify-center w-full gap-x-2">
                    {member.registered && (
                        <p className="text-green-400">REGISTERED</p>
                    )}
                    {member.voted && (
                        <p className="text-green-400">
                            {member.voted && member.registered && (
                                <span className="text-foreground">&</span>
                            )}{" "}
                            VOTED
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default MemberInfoDisplay;
