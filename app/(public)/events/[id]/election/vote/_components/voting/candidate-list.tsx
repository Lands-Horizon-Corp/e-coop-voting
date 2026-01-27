import React from "react";
import { motion } from "framer-motion";

import CandidateCard from "./candidate-card";
import { TCandidatewithPosition } from "@/types";

type Props = {
    maxSelect: number;
    candidates: TCandidatewithPosition[];
    chosenCandidates: TCandidatewithPosition[];
    onAdd: (candidate: TCandidatewithPosition) => void;
    onRemove: (candidate: TCandidatewithPosition) => void;
};

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            duration: 0.8,
            staggerChildren: 0.15,
        },
    },
};

const CandidateList = ({
    maxSelect,
    candidates,
    chosenCandidates,
    onAdd,
    onRemove,
}: Props) => {
    return (
        <motion.div
            key={`${candidates.length}`}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="py-4 lg:py-8 gap-y-4 flex items-center sm:items-start flex-row justify-center flex-wrap w-full"
        >
            {candidates.map((candidate) => (
                <CandidateCard
                    canSelect={chosenCandidates.length < maxSelect}
                    isChosen={
                        chosenCandidates.find(
                            (chosen) => chosen.id === candidate.id
                        ) !== undefined
                    }
                    onSelect={onAdd}
                    onRemove={onRemove}
                    key={candidate.id}
                    candidate={candidate}
                />
            ))}
        </motion.div>
    );
};

export default CandidateList;
