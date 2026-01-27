import React from "react";

import CoopsTable from "./_components/coops-table";

import { currentUserOrFalse } from "@/lib/auth";
import { isAllowed } from "@/lib/utils";
import NotAllowed from "../events/[id]/_components/not-allowed";

type Props = {};

const Branches = async ({}: Props) => {
    const user = await currentUserOrFalse();

    if (!isAllowed(["root"], user))
        return (
            <NotAllowed />
        );

    return (
        <div className="flex p-4 min-h-screen flex-col w-full">
            <CoopsTable />
        </div>
    );
};

export default Branches;
