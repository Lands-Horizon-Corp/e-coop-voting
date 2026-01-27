"use client";
import React from "react";
import CopyUrl from "@/components/copy-url";

import QrCode from "@/components/qr-code";

import { TEvent } from "@/types";
import useOrigin from "@/hooks/use-origin";

type Props = {
    Event: TEvent;
};

const DisplayEventQRLink = ({ Event }: Props) => {
    const { origin } = useOrigin();

    const url = origin.length === 0 ? "" : `${origin}/events/${Event.id}/register`;
    const electionUrl = origin.length > 0 && Event.category === "election" ? `${origin}/events/${Event.id}/election` : "";

    return (
        <div className="flex lg:flex-row gap-x-4 items-center pt-6">
            <div className="flex flex-col gap-y-2 items-center">
                <p className="text-foreground/80 text-sm">Registration QR</p>
                <QrCode className="size-[150px] lg:size-[250px]" themeResponsive={false} value={url} />
                {url.length > 0 && <CopyUrl displayText="Copy registration URL" url={url} />}
            </div>
            {Event.category === "election" && (
                <div className="flex flex-col gap-y-2 items-center">
                    <p className="text-foreground/80 text-sm">Election QR</p>
                    <QrCode className="size-[150px] lg:size-[250px]" themeResponsive={false} value={electionUrl} />
                    {url.length > 0 && <CopyUrl displayText="Copy election URL" url={electionUrl} />}
                </div>
            )}
        </div>
    );
};

export default DisplayEventQRLink;
