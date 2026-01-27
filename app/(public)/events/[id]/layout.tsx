import React from "react";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import EventsNav from "./_components/events-nav";
import AceAdsDrawer from "@/components/ads/ace-ads-drawer";

type Props = { children: React.ReactNode; params: { id: number } };

export const metadata: Metadata = {
    title: {
        default: "Event",
        template: "Event: %s",
    },
    description: "Explore this event",
};

const layout = ({ params, children }: Props) => {
    return (
        <>
            <EventsNav eventId={params.id} />
            {children}
            <AceAdsDrawer>
                <Button className="text-center bg-secondary underline underline-offset-8 text-sm gap-x-2 font-normal rounded-none w-full text-foreground py-4">
                    <img
                        src="/images/ecoop-ads.png"
                        alt="ECoop Screenshot"
                        className="size-8 object-contain inline"
                    />
                    New Ecoop (Cloud Based) is comming soon! 🎉
                </Button>
            </AceAdsDrawer>
        </>
    );
};

export default layout;
