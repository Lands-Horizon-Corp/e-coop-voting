import React from "react";

import BranchesTable from "./_components/branches-table";

import { isAllowed } from "@/lib/utils";
import { currentUserOrFalse } from "@/lib/auth";
import NotAllowed from "../events/[id]/_components/not-allowed";

type Props = {};

const Branches = async ({}: Props) => {
    const user = await currentUserOrFalse();

    if (!isAllowed(["root", "coop_root"], user)) return <NotAllowed />;

    return (
        <div className="flex p-4 min-h-screen flex-col w-full">
            <BranchesTable />
        </div>
    );
};

export default Branches;
