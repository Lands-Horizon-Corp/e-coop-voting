import React from "react";
import UserTable from "./_components/user-table";
import { currentUserOrFalse, currentUserOrThrowAuthError } from "@/lib/auth";
import { isAllowed } from "@/lib/utils";
import NotAllowed from "../events/[id]/_components/not-allowed";

type Props = {};

const UserManagementPage = async (props: Props) => {
    const user = await currentUserOrFalse();

    if (!isAllowed(["root", "coop_root", "admin"], user) || !user)
        return (
            <NotAllowed />
        );

    return (
        <div className="flex p-4 min-h-screen flex-col w-full">
            <UserTable currentUser={user} />
        </div>
    );
};

export default UserManagementPage;
