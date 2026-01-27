import { redirect } from "next/navigation";
import { isAllowed } from "@/lib/utils";
import { currentUserOrFalse } from "@/lib/auth";

import { AdminRoutes } from "./_components/sidebar/sidebar-route";

type Props = {};

const AdminPage = async (props: Props) => {
    const user = await currentUserOrFalse();

    if (!isAllowed(["root", "admin"], user))
        return (
            <div className="flex p-2 h-dvh flex-col items-center justify-center w-full">
                <p>You are not allowed in this page</p>
            </div>
        );

    const allowedPages = AdminRoutes.filter((route) => isAllowed(route.allowedRole, user));

    if (allowedPages.length === 0)
        return (
            <div className="flex justify-center items-center h-dvh">
                <p>Your account role doesn&#39;t have access to any page</p>
            </div>
        );

    return redirect(allowedPages[0].path);
};

export default AdminPage;
