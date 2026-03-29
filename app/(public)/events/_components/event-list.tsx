"use client";
import React from "react";
import { motion, Variants } from "framer-motion";

import EventCard from "./event-card";
import LoadingSpinner from "@/components/loading-spinner";
import { useEventList } from "@/hooks/public-api-hooks/use-events-api";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const EventList = () => {
    const { data: eventList, isFetching, isLoading } = useEventList();

    const loading = isFetching || isLoading;

    return (
        <>
            {loading && <LoadingSpinner />}
            <motion.div
                key={eventList.length}
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="p-4 grid grid-cols-1 px-6 gap-8 md:grid-cols-2 xl:grid-cols-3 justify-center w-full lg:max-w-6xl min-h-[90vh]"
            >
                {eventList.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </motion.div>
            {!loading && eventList.length === 0 && (
                <div className="h-full w-full flex justify-center items-center">
                    <p>There&#39;s no event here yet 🐧</p>
                </div>
            )}
        </>
    );
};

export default EventList;
