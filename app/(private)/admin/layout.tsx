import { Metadata } from "next";
import { ReactNode } from "react";

import NavBar from "./_components/navbar";
import SideBar from "./_components/sidebar";
import SessionProviderWrapper from "@/providers/session-provider-wrapper";

export const metadata: Metadata = {
    title: "Admin",
    description: "Manage events using ACE system",
};

type Props = { children?: ReactNode };
const AdminLayout = async ({ children }: Props) => {
    return (
        <SessionProviderWrapper>
            <div className=" flex flex-col ">
                <div className="fixed lg:hidden w-full z-30">
                    <NavBar />
                </div>
                <div className=" lg:flex hidden fixed h-screen bg-background rounded-r-3xl  flex-col inset-y-0 print:hidden">
                    <SideBar />
                </div>
                <main className="ml-0 lg:ml-[15rem] pt-20 lg:mt-0 lg:p-5 dark:bg-background bg-[#F9F9FB] overflow-x-hidden flex-1">
                    {children}
                </main>
            </div>
        </SessionProviderWrapper>
    );
};

export default AdminLayout;
