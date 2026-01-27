import { Metadata } from "next";
import React, { ReactNode } from "react";

type Props = { children: ReactNode };

export const metadata: Metadata = {
    title: "Explore",
    description:
        "Explore and join ACE system events created by different Coops branches",
};

const PublicLayout = ({ children }: Props) => {
    return (
        <div className="bg-secondary/40 font-poppins">
            <main className="ml-0 overflow-x-hidden flex-1">{children}</main>
        </div>
    );
};

export default PublicLayout;
