import { format } from "date-fns";
import { GiVote } from "react-icons/gi";
import React, { useState } from "react";
import { LuPartyPopper } from "react-icons/lu";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Calendar, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";

import { TEvent } from "@/types";
import { cn } from "@/lib/utils";

type Props = {
    event: TEvent;
    className?: string;
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.2,
            bounce: 0.8,
        },
    },
};

const innerCardVariant: Variants = {
    initial: { y: 0.2 },
    hover: {
        scale: 1.02,
        y: 0,
        transition: {
            duration: 0.2,
            ease: "easeIn",
        },
    },
};

const linkVariant: Variants = {
    shown: {
        y: 0,
        opacity: 1,
        scale: 1.02,
        transition: {
            bounce: 0.4,
            duration: 0.6,
            type: "spring",
        },
    },
    hidden: {
        scale: 0.9,
        y: 48,
        opacity: 0.2,
        transition: {
            ease: "easeIn",
        },
    },
};

const EventCard = ({ className, event }: Props) => {
    const [hover, setHover] = useState(false);

    return (
        <motion.div variants={cardVariants}>
            <motion.div
                variants={innerCardVariant}
                initial="initial"
                whileHover="hover"
                onClick={() => setHover(true)}
                onPointerEnter={() => setHover(true)}
                onPointerLeave={() => setHover(false)}
                className={cn(
                    "relative overflow-clip bg-secondary min-h-[500px] rounded-xl flex flex-col gap-y-4",
                    className
                )}
            >
                <motion.img
                    alt="Event Cover"
                    animate={
                        hover
                            ? { scale: 1.2, transition: { type: "spring" } }
                            : {
                                  scale: 1,
                                  transition: {
                                      type: "spring",
                                      bounce: 0.2,
                                      ease: "easeIn",
                                  },
                              }
                    }
                    src={event.coverImage as ""}
                    className="absolute z-0 top-0 object-cover left-0 rounded-xl w-full h-full"
                />
                <div className="flex-auto" />
                <div className="p-5 bg-popover/80 flex z-40 backdrop-blur-lg relative max-w-full flex-col w-full gap-y-4">
                    <h1 className="text-xl md:text-2xl max-w-full whitespace-nowrap overflow-hidden text-ellipsis dark:text-[#e7e0fb]">
                        {event.title}
                    </h1>
                    <p className="text-foreground/80">{event.description}</p>

                    <motion.div className="flex flex-col gap-y-2">
                        <p className="px-4 py-1 inline-flex items-center gap-x-4 rounded-full bg-secondary text-sm w-fit">
                            <Calendar className="size-4" strokeWidth={1} />
                            {format(event.date, "EEE, MMM dd, yyyy")}
                        </p>

                        <p className="px-4 py-1 inline-flex items-center gap-x-4 rounded-full bg-secondary text-sm w-fit">
                            <MapPin className="size-4" strokeWidth={1} />
                            {event.location}
                        </p>
                        <p className="px-4 py-1 inline-flex items-center gap-x-4 rounded-full bg-secondary text-sm w-fit">
                            {event.category === "event" ? (
                                <LuPartyPopper
                                    className="size-4"
                                    strokeWidth={1}
                                />
                            ) : (
                                <GiVote className="size-4" strokeWidth={1} />
                            )}
                            {event.category === "event"
                                ? "Event"
                                : "Election Event"}
                        </p>
                    </motion.div>
                    <motion.a
                        animate={hover ? "shown" : "hidden"}
                        variants={linkVariant}
                        href={`/events/${event.id}`}
                        className="w-full hidden md:block"
                    >
                        <Button className=" bg-gradient-to-r group from-[#dce2d9] w-full to-[#7fbeed] hover:to-[#d8bce8] text-black/80 hover:text-black rounded-xl px-8 py-4">
                            Go to Event <ArrowRight className="ml-4" />
                        </Button>
                    </motion.a>
                    <a
                        href={`/events/${event.id}`}
                        className="w-full md:hidden block"
                    >
                        <Button className=" bg-gradient-to-r group from-[#dce2d9] w-full to-[#7fbeed] hover:to-[#d8bce8] text-black/80 hover:text-black rounded-xl px-8 py-4">
                            Go to Event <ArrowRight className="ml-4" />
                        </Button>
                    </a>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default EventCard;
