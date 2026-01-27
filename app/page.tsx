import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import AceAdsDrawer from "@/components/ads/ace-ads-drawer";

export default function Home() {
    return (
        <main className="flex min-h-screen relative flex-col items-center justify-center">
            <div className="relative z-10 max-w-5xl gap-y-4 w-full items-center justify-center flex flex-col text-sm ">
                <h1 className="text-5xl text-center">
                    <span className="text-4xl">e</span>COOP ACE SYSTEM
                </h1>
                <p>Attendance Capturing & Election System</p>

                <div className="flex justif-center gap-x-4 items-center">
                    <Link href="/events">
                        <Button>Go to Events</Button>
                    </Link>
                    <Separator
                        className="h-7 bg-foreground/60"
                        orientation="vertical"
                    />
                    <Link href="/admin">
                        <Button>Go to Admin</Button>
                    </Link>
                </div>
            </div>
            <AceAdsDrawer>
                <Button className="text-center absolute bottom-0 bg-secondary underline underline-offset-8 text-sm gap-x-2 font-normal rounded-none w-full text-foreground py-4">
                    <img
                        src="/images/ecoop-ads.png"
                        alt="ECoop Screenshot"
                        className="size-8 object-contain inline"
                    />
                    New Ecoop (Cloud Based) is comming soon! 🎉
                </Button>
            </AceAdsDrawer>
        </main>
    );
}
