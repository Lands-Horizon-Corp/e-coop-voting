"use client";
import React from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { TCandidatewithPosition } from "@/types";

type Props = {
    candidate: TCandidatewithPosition;
    isChosen?: boolean;

    canSelect: boolean;
    onSelect: (candidate: TCandidatewithPosition) => void;
    onRemove: (candidate: TCandidatewithPosition) => void;
};

const cardVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.2, ease: "easeOut" },
    },
};

const CandidateCard = ({
    candidate,
    isChosen,
    canSelect,
    onSelect,
    onRemove,
}: Props) => {
    const { firstName, lastName, picture } = candidate;

    const handleClick = () => {
        if (!isChosen && canSelect) onSelect(candidate);
        else onRemove(candidate);
    };

    return (
        <motion.div
            variants={cardVariants}
            className={cn(
                "p-1 lg:p-4 relative w-1/2 sm:w-[12.5%] lg:w-1/6 space-y-4 duration-300 cursor-hover selection:bg-background/10 cursor-pointer",
                !canSelect && !isChosen && "cursor-not-allowed opacity-50 "
            )}
            onClick={handleClick}
        >
            <div className="relative">
                <div
                    className={cn(
                        "border-secondary rounded-2xl bg-secondary relative ease-out duration-300 overflow-clip border-4 hover:border-green-400",
                        isChosen && "border-green-400"
                    )}
                >
                    <img
                        className="h-[100px] xs:h-[100px] w-full lg:h-[200px] pointer-events-none rounded-none object-cover"
                        src={
                            picture
                                ? `${picture}?${new Date().getTime()}`
                                : "/images/default-avatar.png"
                        }
                    />
                </div>
                <div className="w-full pointer-events-none absolute -bottom-3 left-0 flex justify-center rounded-full ">
                    <div
                        className={cn(
                            "p-1 lg:p-2 rounded-full hidden order-2 bg-green-400 border-secondary text-foreground",
                            isChosen && "block"
                        )}
                    >
                        <Check className="size-5" />
                    </div>
                </div>
            </div>
            <p className="text-sm text-center lg:text-xl font-medium">{`${firstName} ${lastName}`}</p>
        </motion.div>
    );
};

export default CandidateCard;
